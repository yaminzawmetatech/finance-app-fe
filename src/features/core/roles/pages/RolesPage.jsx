import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Paper,
  Typography,
} from "@mui/material";
import Table from "../../../../components/tables/Table";
import DeleteConfirmationModal from "../../../../components/common/DeleteConfirmationModal";
import RoleForm from "../components/RoleForm";
import {
  showErrorToast,
  showSuccessToast,
} from "../../../../components/common/ToastMessage";
import userGroupsService from "../services/rolesService";

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
  const [loadError, setLoadError] = useState("");

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

  const openForm = (group = null) => {
    setEditGroup(group);
    setFormOpen(true);
  };

  const handleSave = async ({
    name,
    description,
    permissions: selectedPermissions,
  }) => {
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

      <RoleForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSave}
        editData={editGroup}
        isLoading={isSaving}
        permissions={permissions}
      />

      <DeleteConfirmationModal
        isOpen={Boolean(deleteGroup)}
        onClose={() => setDeleteGroup(null)}
        onDelete={handleDelete}
        message={`Delete user group "${deleteGroup?.name || ""}"?`}
      />
    </Box>
  );
}