import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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
import positionsService from "../services/positionsService";

const getItems = (response) => {
  const payload = response?.data ?? response;
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
};

export default function PositionsPage() {
  const [positions, setPositions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editPosition, setEditPosition] = useState(null);
  const [deletePosition, setDeletePosition] = useState(null);
  const [loadError, setLoadError] = useState("");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: { name: "", description: "" } });

  const loadPositions = useCallback(async () => {
    try {
      const response = await positionsService.getPositions();
      setPositions(getItems(response));
      setLoadError("");
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || "Unable to load positions.";
      setLoadError(
        typeof message === "string" ? message : "Unable to load positions."
      );
      showErrorToast(
        typeof message === "string" ? message : "Unable to load positions."
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPositions();
  }, [loadPositions]);

  const columns = useMemo(
    () => [
      { accessorKey: "name", header: "Position", size: 240 },
      { accessorKey: "description", header: "Description", size: 400 },
      { accessorKey: "created_at", header: "Created Date", size: 200 },
    ],
    []
  );

  const openForm = (position = null) => {
    setEditPosition(position);
    reset({
      name: position?.name || "",
      description: position?.description === "---" ? "" : position?.description || "",
    });
    setFormOpen(true);
  };

  const handleSave = async ({ name, description }) => {
    setIsSaving(true);
    try {
      const payload = { name: name.trim(), description: description.trim() };
      if (editPosition) {
        await positionsService.updatePosition(
          editPosition.uuid || editPosition.id,
          payload
        );
      } else {
        await positionsService.createPosition(payload);
      }
      showSuccessToast(
        editPosition ? "Position updated." : "Position created."
      );
      setFormOpen(false);
      setEditPosition(null);
      await loadPositions();
    } catch (error) {
      showErrorToast(
        error.response?.data?.message ||
          error.message ||
          "Unable to save position."
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletePosition) return;
    setIsSaving(true);
    try {
      await positionsService.deletePosition(
        deletePosition.uuid || deletePosition.id
      );
      showSuccessToast("Position deleted.");
      setDeletePosition(null);
      await loadPositions();
    } catch (error) {
      showErrorToast(
        error.response?.data?.message ||
          error.message ||
          "Unable to delete position."
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
        Position Management
      </Typography>
      {loadError && <Alert severity="error" sx={{ mb: 2 }}>{loadError}</Alert>}
      <Paper sx={{ width: "100%", p: 2 }}>
        <Table
          columns={columns}
          data={positions}
          isLoading={isLoading}
          onCreate={() => openForm()}
          onEdit={(row) => openForm(row.original)}
          onDelete={(row) => setDeletePosition(row.original)}
          createButtonLabel="Create Position"
        />
      </Paper>

      <Dialog
        open={formOpen}
        onClose={() => !isSaving && setFormOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {editPosition ? "Edit Position" : "Create Position"}
        </DialogTitle>
        <Box component="form" onSubmit={handleSubmit(handleSave)}>
          <DialogContent sx={{ display: "grid", gap: 2, pt: 1 }}>
            <TextField
              label="Position Name"
              fullWidth
              {...register("name", { required: "Position name is required." })}
              error={Boolean(errors.name)}
              helperText={errors.name?.message}
            />
            <TextField
              label="Description"
              fullWidth
              multiline
              minRows={2}
              {...register("description")}
            />
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setFormOpen(false)} disabled={isSaving}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={isSaving}>
              {isSaving ? "Saving..." : editPosition ? "Save Changes" : "Create"}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      <DeleteConfirmationModal
        isOpen={Boolean(deletePosition)}
        onClose={() => setDeletePosition(null)}
        onDelete={handleDelete}
        message={`Delete position "${deletePosition?.name || ""}"?`}
      />
    </Box>
  );
}
