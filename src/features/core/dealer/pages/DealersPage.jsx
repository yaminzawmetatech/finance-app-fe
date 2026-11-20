import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Alert, Box, Button, Paper, Typography } from "@mui/material";
import Table from "../../../../components/tables/Table";
import DeleteConfirmationModal from "../../../../components/common/DeleteConfirmationModal";
import { showErrorToast, showSuccessToast } from "../../../../components/common/ToastMessage";
import DealerForm from "../components/DealerForm";
import {
  createDealer,
  deleteDealer,
  fetchDealers,
  updateDealer,
} from "../store/dealersSlice";

const getErrorMessage = (error, fallback) => {
  if (typeof error === "string") return error;
  const message = error.response?.data?.message ?? error.message;
  if (typeof message === "string") return message;
  if (message && typeof message === "object") {
    return Object.entries(message)
      .flatMap(([field, errors]) =>
        (Array.isArray(errors) ? errors : [errors]).map((item) => `${field}: ${item}`)
      )
      .join("\n");
  }
  return fallback;
};

export default function DealersPage() {
  const dispatch = useDispatch();
  const { items: dealers, isLoading, isSaving } = useSelector((state) => state.dealers);
  const [formOpen, setFormOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteData, setDeleteData] = useState(null);
  const [loadError, setLoadError] = useState("");

  const loadDealers = useCallback(async () => {
    try {
      await dispatch(fetchDealers()).unwrap();
      setLoadError("");
    } catch (error) {
      const message = getErrorMessage(error, "Unable to load dealers.");
      setLoadError(message);
      showErrorToast(message);
    }
  }, [dispatch]);

  useEffect(() => {
    loadDealers();
  }, [loadDealers]);

  const columns = useMemo(() => [
    { accessorKey: "name", header: "Dealer Name", size: 220 },
    { accessorKey: "owner_name", header: "Owner Name", size: 180 },
    { accessorKey: "dealer_type", header: "Dealer Type", size: 160 },
    { accessorKey: "showroom_ph_no", header: "Phone", size: 160 },
    { accessorKey: "created_at", header: "Created Date", size: 180 },
  ], []);

  const handleSave = async (values) => {
    try {
      if (editData) {
        await dispatch(updateDealer({
          uuid: editData.uuid || editData.id,
          data: values,
        })).unwrap();
      } else {
        await dispatch(createDealer(values)).unwrap();
      }
      showSuccessToast(`Dealer ${editData ? "updated" : "created"}.`);
      setFormOpen(false);
      setEditData(null);
      await loadDealers();
    } catch (error) {
      showErrorToast(getErrorMessage(error, "Unable to save dealer."));
    }
  };

  const handleDelete = async () => {
    if (!deleteData) return;
    try {
      await dispatch(deleteDealer(deleteData.uuid || deleteData.id)).unwrap();
      showSuccessToast("Dealer deleted.");
      setDeleteData(null);
      await loadDealers();
    } catch (error) {
      showErrorToast(getErrorMessage(error, "Unable to delete dealer."));
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Typography component="h1" variant="h5" sx={{ mb: 2 }}>Dealer Management</Typography>
      {loadError && <Alert severity="error" sx={{ mb: 2 }}>{loadError}</Alert>}
      <Paper sx={{ width: "100%", p: 2 }}>
        <Table
          columns={columns}
          data={dealers}
          isLoading={isLoading}
          onCreate={() => { setEditData(null); setFormOpen(true); }}
          onEdit={(row) => { setEditData(row.original); setFormOpen(true); }}
          onDelete={(row) => setDeleteData(row.original)}
          createButtonLabel="Create Dealer"
          getRowId={(row) => row.uuid || String(row.id)}
          renderTopToolbarCustomActions={() => (
            <Button
              variant="contained"
              disabled={isSaving}
              onClick={() => { setEditData(null); setFormOpen(true); }}
            >
              Create Dealer
            </Button>
          )}
        />
      </Paper>
      <DealerForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSave}
        editData={editData}
        isLoading={isSaving}
      />
      <DeleteConfirmationModal
        isOpen={Boolean(deleteData)}
        onClose={() => !isSaving && setDeleteData(null)}
        onDelete={handleDelete}
        isLoading={isSaving}
        title="Delete Dealer?"
        message={`Are you sure you want to delete "${deleteData?.name || ""}"? This action cannot be undone.`}
      />
    </Box>
  );
}
