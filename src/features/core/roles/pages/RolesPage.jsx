import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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
import {
  createRole,
  deleteRole,
  fetchRolePermissions,
  fetchRoles,
  updateRole,
} from "../store/rolesSlice";

const getPermissionNames = (permissions = []) =>
  permissions.map((permission) =>
    typeof permission === "string" ? permission : permission.name
  );

export default function RolesPage() {
  const dispatch = useDispatch();
  const {
    items: groups,
    permissions,
    isLoading: isRolesLoading,
    isLoadingPermissions,
    isSaving,
  } = useSelector((state) => state.roles);
  const isLoading = isRolesLoading || isLoadingPermissions;
  const [formOpen, setFormOpen] = useState(false);
  const [editGroup, setEditGroup] = useState(null);
  const [deleteGroup, setDeleteGroup] = useState(null);
  const [loadError, setLoadError] = useState("");

  const loadData = useCallback(async () => {
    try {
      await Promise.all([
        dispatch(fetchRoles()).unwrap(),
        dispatch(fetchRolePermissions()).unwrap(),
      ]);
      setLoadError("");
    } catch (error) {
      const message = typeof error === "string"
        ? error
        : error.response?.data?.message || error.message || "Unable to load groups.";
      setLoadError(message);
      showErrorToast(message);
    }
  }, [dispatch]);

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
    try {
      const payload = {
        name: name.trim(),
        description: description.trim(),
        permissions: selectedPermissions,
      };
      if (editGroup) {
        await dispatch(updateRole({
          uuid: editGroup.uuid || editGroup.id,
          data: payload,
        })).unwrap();
      } else {
        await dispatch(createRole(payload)).unwrap();
      }
      showSuccessToast(
        editGroup ? "User group updated." : "User group created."
      );
      setFormOpen(false);
      setEditGroup(null);
      await loadData();
    } catch (error) {
      showErrorToast(
        typeof error === "string"
          ? error
          : error.response?.data?.message || error.message || "Unable to save group."
      );
    }
  };

  const handleDelete = async () => {
    if (!deleteGroup) return;
    try {
      await dispatch(
        deleteRole(deleteGroup.uuid || deleteGroup.id)
      ).unwrap();
      showSuccessToast("User group deleted.");
      setDeleteGroup(null);
      await loadData();
    } catch (error) {
      showErrorToast(
        typeof error === "string"
          ? error
          : error.response?.data?.message || error.message || "Unable to delete group."
      );
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