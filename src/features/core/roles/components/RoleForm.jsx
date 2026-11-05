import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";

const EMPTY_ROLE = { name: "", description: "" };

const getPermissionNames = (permissions = []) =>
  permissions.map((permission) =>
    typeof permission === "string" ? permission : permission.name
  );

export default function RoleForm({
  open,
  onClose,
  onSubmit,
  editData,
  isLoading,
  permissions = [],
}) {
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [permissionSearch, setPermissionSearch] = useState("");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: EMPTY_ROLE });

  useEffect(() => {
    if (!open) return;
    reset({
      name: editData?.name || "",
      description: editData?.description || "",
    });
    setSelectedPermissions(getPermissionNames(editData?.permissions || []));
    setPermissionSearch("");
  }, [open, editData, reset]);

  const filteredPermissions = useMemo(() => {
    const query = permissionSearch.trim().toLocaleLowerCase();
    return query
      ? permissions.filter((permission) =>
          permission.name.toLocaleLowerCase().includes(query)
        )
      : permissions;
  }, [permissions, permissionSearch]);

  const submitForm = (values) =>
    onSubmit({ ...values, permissions: selectedPermissions });

  return (
    <Dialog
      open={open}
      onClose={() => !isLoading && onClose()}
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
        {editData ? "Edit User Group" : "Create User Group"}
      </DialogTitle>
      <Box
        component="form"
        onSubmit={handleSubmit(submitForm)}
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
                            checked={selectedPermissions.includes(
                              permission.name
                            )}
                            onChange={(event) =>
                              setSelectedPermissions((current) =>
                                event.target.checked
                                  ? [...current, permission.name]
                                  : current.filter(
                                      (name) => name !== permission.name
                                    )
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
          <Button onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={isLoading}>
            {isLoading ? "Saving..." : editData ? "Save Changes" : "Create"}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
