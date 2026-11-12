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
import PositionForm from "../components/PositionForm";
import {
  showErrorToast,
  showSuccessToast,
} from "../../../../components/common/ToastMessage";
import {
  createPosition,
  deletePosition as deletePositionThunk,
  fetchPositions,
  updatePosition,
} from "../store/positionsSlice";

export default function PositionsPage() {
  const dispatch = useDispatch();
  const { items: positions, isLoading, isSaving } = useSelector(
    (state) => state.positions
  );
  const [formOpen, setFormOpen] = useState(false);
  const [editPosition, setEditPosition] = useState(null);
  const [deletePosition, setDeletePosition] = useState(null);
  const [loadError, setLoadError] = useState("");
  const loadPositions = useCallback(async () => {
    try {
      await dispatch(fetchPositions()).unwrap();
      setLoadError("");
    } catch (error) {
      const message = typeof error === "string"
        ? error
        : error.response?.data?.message || error.message || "Unable to load positions.";
      setLoadError(
        typeof message === "string" ? message : "Unable to load positions."
      );
      showErrorToast(
        typeof message === "string" ? message : "Unable to load positions."
      );
    }
  }, [dispatch]);

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
    setFormOpen(true);
  };

  const handleSave = async ({ name, description }) => {
    try {
      const payload = { name: name.trim(), description: description.trim() };
      if (editPosition) {
        await dispatch(updatePosition({
          uuid: editPosition.uuid || editPosition.id,
          data: payload,
        })).unwrap();
      } else {
        await dispatch(createPosition(payload)).unwrap();
      }
      showSuccessToast(
        editPosition ? "Position updated." : "Position created."
      );
      setFormOpen(false);
      setEditPosition(null);
      await loadPositions();
    } catch (error) {
      showErrorToast(
        typeof error === "string"
          ? error
          : error.response?.data?.message || error.message || "Unable to save position."
      );
    }
  };

  const handleDelete = async () => {
    if (!deletePosition) return;
    try {
      await dispatch(
        deletePositionThunk(deletePosition.uuid || deletePosition.id)
      ).unwrap();
      showSuccessToast("Position deleted.");
      setDeletePosition(null);
      await loadPositions();
    } catch (error) {
      showErrorToast(
        typeof error === "string"
          ? error
          : error.response?.data?.message || error.message || "Unable to delete position."
      );
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

      <PositionForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSave}
        editData={editPosition}
        isLoading={isSaving}
      />

      <DeleteConfirmationModal
        isOpen={Boolean(deletePosition)}
        onClose={() => setDeletePosition(null)}
        onDelete={handleDelete}
        message={`Delete position "${deletePosition?.name || ""}"?`}
      />
    </Box>
  );
}
