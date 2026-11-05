import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Alert, Box, Button, Paper, Typography } from "@mui/material";
import Table from "../../../../components/tables/Table";
import DeleteConfirmationModal from "../../../../components/common/DeleteConfirmationModal";
import {
  showErrorToast,
  showSuccessToast,
} from "../../../../components/common/ToastMessage";
import AddressStateForm from "../components/AddressStateForm";
import addressStatesService from "../services/addressStatesService";

const getItems = (response) => {
  const payload = response?.data ?? response;
  return Array.isArray(payload) ? payload : Array.isArray(payload?.data) ? payload.data : [];
};

const getErrorMessage = (error, fallback) => {
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

export default function AddressStatesPage() {
  const [states, setStates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editState, setEditState] = useState(null);
  const [deleteData, setDeleteData] = useState(null);
  const [loadError, setLoadError] = useState("");
  const importRef = useRef(null);

  const loadStates = useCallback(async () => {
    try {
      setStates(getItems(await addressStatesService.getAll()));
      setLoadError("");
    } catch (error) {
      const message = getErrorMessage(error, "Unable to load address states.");
      setLoadError(message);
      showErrorToast(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { loadStates(); }, [loadStates]);

  const columns = useMemo(() => [
    { accessorKey: "sr_pcode", header: "State / Region P-Code", size: 190 },
    { accessorKey: "name", header: "State / Region", size: 240 },
    { accessorKey: "state_mya_mm3", header: "Myanmar Name", size: 240 },
    { accessorKey: "description", header: "Description", size: 300 },
    { accessorKey: "is_blacklisted", header: "Blacklisted", size: 130 },
    { accessorKey: "created_by", header: "Created By", size: 160 },
    { accessorKey: "created_at", header: "Created Date", size: 180 },
  ], []);

  const handleSave = async (values) => {
    setIsSaving(true);
    try {
      if (editState) {
        await addressStatesService.update(editState.uuid || editState.id, values);
      } else {
        await addressStatesService.create(values);
      }
      showSuccessToast(`Address State ${editState ? "updated" : "created"}.`);
      setFormOpen(false);
      setEditState(null);
      await loadStates();
    } catch (error) {
      showErrorToast(getErrorMessage(error, "Unable to save address state."));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteData) return;
    setIsSaving(true);
    try {
      await addressStatesService.delete(deleteData.uuid || deleteData.id);
      showSuccessToast("Address State deleted.");
      setDeleteData(null);
      await loadStates();
    } catch (error) {
      showErrorToast(getErrorMessage(error, "Unable to delete address state."));
    } finally {
      setIsSaving(false);
    }
  };

  const handleImport = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setIsImporting(true);
    try {
      const result = await addressStatesService.importFile(file);
      const payload = result?.data ?? result;
      showSuccessToast(
        Number.isFinite(payload?.rowCount)
          ? `Imported ${payload.rowCount} address state(s).`
          : "Address states imported."
      );
      await loadStates();
    } catch (error) {
      showErrorToast(getErrorMessage(error, "Unable to import address states."));
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Typography component="h1" variant="h5" sx={{ mb: 2 }}>Address State Management</Typography>
      {loadError && <Alert severity="error" sx={{ mb: 2 }}>{loadError}</Alert>}
      <Paper sx={{ width: "100%", p: 2 }}>
        <Table
          columns={columns}
          data={states}
          isLoading={isLoading}
          onCreate={() => { setEditState(null); setFormOpen(true); }}
          onEdit={(row) => { setEditState(row.original); setFormOpen(true); }}
          onDelete={(row) => setDeleteData(row.original)}
          createButtonLabel="Create Address State"
          getRowId={(row) => row.uuid || String(row.id)}
          renderTopToolbarCustomActions={() => (
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button variant="contained" disabled={isSaving || isImporting} onClick={() => { setEditState(null); setFormOpen(true); }}>
                Create Address State
              </Button>
              <Button variant="outlined" disabled={isSaving || isImporting} onClick={() => importRef.current?.click()}>
                {isImporting ? "Importing..." : "Import Excel"}
              </Button>
              <input ref={importRef} hidden type="file" accept=".xlsx,.xls,.csv" onChange={handleImport} />
            </Box>
          )}
        />
      </Paper>
      <AddressStateForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSave}
        editData={editState}
        isLoading={isSaving}
      />
      <DeleteConfirmationModal
        isOpen={Boolean(deleteData)}
        onClose={() => !isSaving && setDeleteData(null)}
        onDelete={handleDelete}
        isLoading={isSaving}
        title="Delete address state?"
        message={`Are you sure you want to delete "${deleteData?.name || ""}"? This action cannot be undone.`}
      />
    </Box>
  );
}
