import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";
import Table from "../../../components/tables/Table";
import DeleteConfirmationModal from "../../../components/common/DeleteConfirmationModal";
import {
  showErrorToast,
  showSuccessToast,
} from "../../../components/common/ToastMessage";
import userGroupsService from "../services/userGroupsService";

const getItems = (response) => {
  const payload = response?.data ?? response;
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
};

const getPermissionNames = (permissions = []) =>
  permissions.map((permission) =>
    typeof permission === "string" ? permission : permission.name
  );

export default function RolesPage() {
  const [groups, setGroups] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editGroup, setEditGroup] = useState(null);
  const [deleteGroup, setDeleteGroup] = useState(null);
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [permissionSearch, setPermissionSearch] = useState("");
  const [loadError, setLoadError] = useState("");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: { name: "", description: "" } });

  const loadData = useCallback(async () => {
    try {
      const [groupResponse, permissionResponse] = await Promise.all([
        userGroupsService.getUserGroups(),
        userGroupsService.getPermissions(),
      ]);
      setLoadError("");
      setGroups(getItems(groupResponse));
      setPermissions(getItems(permissionResponse));
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || "Unable to load groups.";
      setLoadError(message);
      showErrorToast(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const columns = useMemo(
    () => [
      { accessorKey: "name", header: "User Group", size: 220 },
      { accessorKey: "description", header: "Description", size: 300 },
      {
        accessorFn: (row) => getPermissionNames(row.permissions || []).join(", "),
        id: "permissions",
        header: "Permissions",
        size: 440,
      },
    ],
    []
  );

  const filteredPermissions = useMemo(() => {
    const query = permissionSearch.trim().toLocaleLowerCase();
    return query
      ? permissions.filter((permission) =>
          permission.name.toLocaleLowerCase().includes(query)
        )
      : permissions;
  }, [permissions, permissionSearch]);

  const openForm = (group = null) => {
    setEditGroup(group);
    setPermissionSearch("");
    reset({
      name: group?.name || "",
      description: group?.description || "",
    });
    setSelectedPermissions(getPermissionNames(group?.permissions || []));
    setFormOpen(true);
  };

  const handleSave = async ({ name, description }) => {
    setIsSaving(true);
    try {
      const payload = {
        name: name.trim(),
        description: description.trim(),
        permissions: selectedPermissions,
      };
      if (editGroup) {
        await userGroupsService.updateUserGroup(
          editGroup.uuid || editGroup.id,
          payload
        );
      } else {
        await userGroupsService.createUserGroup(payload);
      }
      showSuccessToast(
        editGroup ? "User group updated." : "User group created."
      );
      setFormOpen(false);
      setEditGroup(null);
      await loadData();
    } catch (error) {
      showErrorToast(
        error.response?.data?.message || error.message || "Unable to save group."
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteGroup) return;
    setIsSaving(true);
    try {
      await userGroupsService.deleteUserGroup(
        deleteGroup.uuid || deleteGroup.id
      );
      showSuccessToast("User group deleted.");
      setDeleteGroup(null);
      await loadData();
    } catch (error) {
      showErrorToast(
        error.response?.data?.message || error.message || "Unable to delete group."
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
        User Groups
      </Typography>
      {loadError && <Alert severity="error" sx={{ mb: 2 }}>{loadError}</Alert>}
      <Paper sx={{ width: "100%", p: 2 }}>
        <Table
          columns={columns}
          data={groups}
          isLoading={isLoading}
          onCreate={() => openForm()}
          onEdit={(row) => openForm(row.original)}
          onDelete={(row) => setDeleteGroup(row.original)}
          createButtonLabel="Create User Group"
        />
      </Paper>

      <Dialog
        open={formOpen}
        onClose={() => !isSaving && setFormOpen(false)}
        fullWidth
        maxWidth="md"
        PaperProps={{
          sx: {
            display: "flex",
            maxHeight: "calc(100vh - 48px)",
          },
        }}
      >
        <DialogTitle>
          {editGroup ? "Edit User Group" : "Create User Group"}
        </DialogTitle>
        <Box
          component="form"
          onSubmit={handleSubmit(handleSave)}
          sx={{ display: "flex", flexDirection: "column", minHeight: 0 }}
        >
          <DialogContent sx={{ overflow: "hidden" }}>
            <Grid container spacing={2} sx={{ mt: 0.5 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Name"
                  fullWidth
                  {...register("name", { required: "Name is required." })}
                  error={Boolean(errors.name)}
                  helperText={errors.name?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Description"
                  fullWidth
                  {...register("description")}
                />
              </Grid>
              <Grid item xs={12} sx={{ width: "100%", minWidth: 0 }}>
                <TextField
                  label="Search permissions"
                  placeholder="Type a permission name"
                  size="small"
                  fullWidth
                  value={permissionSearch}
                  onChange={(event) => setPermissionSearch(event.target.value)}
                  sx={{ mb: 1.5 }}
                />
                <Box
                  sx={{
                    width: "100%",
                    minWidth: 0,
                    maxHeight: 280,
                    overflowY: "auto",
                    overflowX: "hidden",
                    border: 1,
                    borderColor: "divider",
                    borderRadius: 1,
                    p: 1,
                  }}
                >
                  {filteredPermissions.length ? (
                    <Box
                      sx={{
                        width: "100%",
                        display: "grid",
                        gridTemplateColumns: {
                          xs: "1fr",
                          sm: "repeat(2, minmax(0, 1fr))",
                          md: "repeat(3, minmax(0, 1fr))",
                        },
                        columnGap: 1,
                      }}
                    >
                      {filteredPermissions.map((permission) => (
                        <FormControlLabel
                          key={permission.id || permission.name}
                          label={permission.name}
                          control={
                            <Checkbox
                              size="small"
                              checked={selectedPermissions.includes(permission.name)}
                              onChange={(event) =>
                                setSelectedPermissions((current) =>
                                  event.target.checked
                                    ? [...current, permission.name]
                                    : current.filter((name) => name !== permission.name)
                                )
                              }
                            />
                          }
                          sx={{
                            minWidth: 0,
                            m: 0,
                            "& .MuiFormControlLabel-label": {
                              overflowWrap: "anywhere",
                            },
                          }}
                        />
                      ))}
                    </Box>
                  ) : (
                    <Typography color="text.secondary">
                      {permissions.length
                        ? "No permissions match your search."
                        : "No permissions are available."}
                    </Typography>
                  )}
                </Box>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setFormOpen(false)} disabled={isSaving}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={isSaving}>
              {isSaving ? "Saving..." : editGroup ? "Save Changes" : "Create"}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      <DeleteConfirmationModal
        isOpen={Boolean(deleteGroup)}
        onClose={() => setDeleteGroup(null)}
        onDelete={handleDelete}
        message={`Delete user group "${deleteGroup?.name || ""}"?`}
      />
    </Box>
  );
}