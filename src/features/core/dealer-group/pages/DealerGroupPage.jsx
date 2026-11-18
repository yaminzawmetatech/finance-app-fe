import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Alert, Box, Button, Paper, Typography } from "@mui/material";
import Table from "../../../../components/tables/Table";
import DeleteConfirmationModal from "../../../../components/common/DeleteConfirmationModal";
import {
  showErrorToast,
  showSuccessToast,
} from "../../../../components/common/ToastMessage";
import DealerGroupForm from "../components/DealerGroupForm";
import {
  createDealerGroup,
  deleteDealerGroup,
  fetchDealerGroups,
  updateDealerGroup,
} from "../store/dealerGroupsSlice";

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

export default function DealerGroupPage() {
  const dispatch = useDispatch();
  const { items: dealerGroups, isLoading, isSaving, isImporting } = useSelector(
    (state) => state.dealerGroups
  );
  const [formOpen, setFormOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteData, setDeleteData] = useState(null);
  const [loadError, setLoadError] = useState("");
  const importRef = useRef(null);

  const loadCatgories = useCallback(async () => {
    try {
      await dispatch(fetchDealerGroups()).unwrap();
      setLoadError("");
    } catch (error) {
      const message = getErrorMessage(error, "Unable to load Dealer Groups.");
      setLoadError(message);
      showErrorToast(message);
    }
  }, [dispatch]);

  useEffect(() => { loadCatgories(); }, [loadCatgories]);

  const columns = useMemo(() => [
    { accessorKey: "name", header: "Name", size: 240 },
    { accessorKey: "code", header: "Code", size: 240 },
    { accessorKey: "description", header: "Description", size: 300 },
    { accessorKey: "created_by", header: "Created By", size: 160 },
    { accessorKey: "created_at", header: "Created Date", size: 180 },
  ], []);

  const handleSave = async (values) => {
    try {
      if (editData) {
        await dispatch(updateDealerGroup({
          uuid: editData.uuid || editData.id,
          data: values,
        })).unwrap();
      } else {
        await dispatch(createDealerGroup(values)).unwrap();
      }
      showSuccessToast(`Dealer Group ${editData ? "updated" : "created"}.`);
      setFormOpen(false);
      setEditData(null);
      await loadCatgories();
    } catch (error) {
      showErrorToast(getErrorMessage(error, "Unable to save dealer group."));
    }
  };

  const handleDelete = async () => {
    if (!deleteData) return;
    try {
      await dispatch(
        deleteDealerGroup(deleteData.uuid || deleteData.id)
      ).unwrap();
      showSuccessToast("Dealer group deleted.");
      setDeleteData(null);
      await loadCatgories();
    } catch (error) {
      showErrorToast(getErrorMessage(error, "Unable to delete dealer group."));
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Typography component="h1" variant="h5" sx={{ mb: 2 }}>Dealer Group Management</Typography>
      {loadError && <Alert severity="error" sx={{ mb: 2 }}>{loadError}</Alert>}
      <Paper sx={{ width: "100%", p: 2 }}>
        <Table
          columns={columns}
          data={dealerGroups}
          isLoading={isLoading}
          onCreate={() => { setEditData(null); setFormOpen(true); }}
          onEdit={(row) => { setEditData(row.original); setFormOpen(true); }}
          onDelete={(row) => setDeleteData(row.original)}
          createButtonLabel="Create Dealer Group"
          getRowId={(row) => row.uuid || String(row.id)}
          renderTopToolbarCustomActions={() => (
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button variant="contained" disabled={isSaving || isImporting} onClick={() => { setEditData(null); setFormOpen(true); }}>
                Create Dealer Group
              </Button>
            </Box>
          )}
        />
      </Paper>
      <DealerGroupForm
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
        title="Delete Dealer Group?"
        message={`Are you sure you want to delete "${deleteData?.name || ""}"? This action cannot be undone.`}
      />
    </Box>
  );
}
