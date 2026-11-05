import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Paper,
  Typography,
} from "@mui/material";
import Table from "../../../../components/tables/Table";
import DeleteConfirmationModal from "../../../../components/common/DeleteConfirmationModal";
import DepartmentForm from "../components/DepartmentForm";
import {
  showErrorToast,
  showSuccessToast,
} from "../../../../components/common/ToastMessage";
import departmentsService from "../services/departmentsService";

const getItems = (response) => {
  const payload = response?.data ?? response;
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
};

const getErrorMessage = (error, fallback) => {
  const message = error.response?.data?.message ?? error.message;
  if (typeof message === "string") return message;
  if (message && typeof message === "object") {
    return Object.entries(message)
      .flatMap(([field, errors]) =>
        (Array.isArray(errors) ? errors : [errors]).map(
          (item) => `${field}: ${item}`
        )
      )
      .join("\n");
  }
  return fallback;
};

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editDepartment, setEditDepartment] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  const [rowSelection, setRowSelection] = useState({});
  const [loadError, setLoadError] = useState("");
  const loadDepartments = useCallback(async () => {
    try {
      const response = await departmentsService.getDepartments();
      setDepartments(getItems(response));
      setLoadError("");
    } catch (error) {
      const message = getErrorMessage(error, "Unable to load departments.");
      setLoadError(message);
      showErrorToast(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDepartments();
  }, [loadDepartments]);

  const columns = useMemo(
    () => [
      { accessorKey: "name", header: "Department", size: 260 },
      { accessorKey: "description", header: "Description", size: 420 },
      { accessorKey: "created_at", header: "Created Date", size: 200 },
    ],
    []
  );

  const openForm = (department = null) => {
    setEditDepartment(department);
    setFormOpen(true);
  };

  const handleSave = async ({ name, description }) => {
    setIsSaving(true);
    try {
      const payload = {
        name: name.trim(),
        description: description.trim(),
      };
      if (editDepartment) {
        await departmentsService.updateDepartment(
          editDepartment.uuid || editDepartment.id,
          payload
        );
      } else {
        await departmentsService.createDepartment(payload);
      }
      showSuccessToast(
        editDepartment ? "Department updated." : "Department created."
      );
      setFormOpen(false);
      setEditDepartment(null);
      await loadDepartments();
    } catch (error) {
      showErrorToast(getErrorMessage(error, "Unable to save department."));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirmation) return;
    setIsSaving(true);
    try {
      if (deleteConfirmation.type === "batch") {
        await departmentsService.batchDeleteDepartments(
          deleteConfirmation.uuids
        );
        showSuccessToast("Selected departments deleted.");
      } else {
        await departmentsService.deleteDepartment(
          deleteConfirmation.department.uuid ||
            deleteConfirmation.department.id
        );
        showSuccessToast("Department deleted.");
      }
      setDeleteConfirmation(null);
      setRowSelection({});
      await loadDepartments();
    } catch (error) {
      showErrorToast(
        getErrorMessage(error, "Unable to delete department(s).")
      );
    } finally {
      setIsSaving(false);
    }
  };

  const selectedCount = Object.keys(rowSelection).length;

  return (
    <Box sx={{ width: "100%" }}>
      <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
        Department Management
      </Typography>
      {loadError && <Alert severity="error" sx={{ mb: 2 }}>{loadError}</Alert>}
      <Paper sx={{ width: "100%", p: 2 }}>
        <Table
          columns={columns}
          data={departments}
          isLoading={isLoading}
          onEdit={(row) => openForm(row.original)}
          onDelete={(row) =>
            setDeleteConfirmation({
              type: "single",
              department: row.original,
            })
          }
          enableRowSelection
          positionToolbarAlertBanner="none"
          getRowId={(row) => row.uuid || String(row.id)}
          onRowSelectionChange={setRowSelection}
          state={{ rowSelection }}
          renderTopToolbarCustomActions={({ table }) => (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              <Button
                variant="contained"
                onClick={() => openForm()}
                disabled={isSaving}
              >
                Create Department
              </Button>
              {selectedCount > 0 && (
                <Button
                  variant="outlined"
                  color="error"
                  disabled={isSaving}
                  onClick={() => {
                    const selectedRows = table.getSelectedRowModel().rows;
                    const uuids = selectedRows.map((row) => row.original.uuid);
                    if (uuids.some((uuid) => !uuid)) {
                      showErrorToast(
                        "Cannot delete selected departments: a selected department has no UUID."
                      );
                    } else if (uuids.length) {
                      setDeleteConfirmation({ type: "batch", uuids });
                    }
                  }}
                >
                  Delete Selected ({selectedCount})
                </Button>
              )}
            </Box>
          )}
        />
      </Paper>

      <DepartmentForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSave}
        editData={editDepartment}
        isLoading={isSaving}
      />

      <DeleteConfirmationModal
        isOpen={Boolean(deleteConfirmation)}
        onClose={() => !isSaving && setDeleteConfirmation(null)}
        onDelete={handleDelete}
        isLoading={isSaving}
        title={
          deleteConfirmation?.type === "batch"
            ? "Delete selected departments?"
            : "Delete department?"
        }
        message={
          deleteConfirmation?.type === "batch"
            ? `You are about to delete ${deleteConfirmation.uuids.length} department(s). This action cannot be undone.`
            : `Are you sure you want to delete "${deleteConfirmation?.department?.name || ""}"? This action cannot be undone.`
        }
      />
    </Box>
  );
}
