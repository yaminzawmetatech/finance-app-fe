import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Alert, Box, Button, Paper, Typography } from "@mui/material";
import Table from "../../../../components/tables/Table";
import DeleteConfirmationModal from "../../../../components/common/DeleteConfirmationModal";
import { showErrorToast, showSuccessToast } from "../../../../components/common/ToastMessage";
import AddressVillageForm from "../components/AddressVillageForm";
import addressVillagesService from "../services/addressVillagesService";

const getItems = (response) => {
  const payload = response?.data ?? response;
  return Array.isArray(payload) ? payload : Array.isArray(payload?.data) ? payload.data : [];
};
const getErrorMessage = (error, fallback) => {
  const message = error.response?.data?.message ?? error.message;
  if (typeof message === "string") return message;
  if (message && typeof message === "object") return Object.entries(message).flatMap(([field, errors]) => (Array.isArray(errors) ? errors : [errors]).map((item) => `${field}: ${item}`)).join("\n");
  return fallback;
};

export default function AddressVillagesPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [importing, setImporting] = useState(false);
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteData, setDeleteData] = useState(null);
  const [loadError, setLoadError] = useState("");
  const importRef = useRef(null);
  const loadData = useCallback(async () => {
    try { setItems(getItems(await addressVillagesService.getAll())); setLoadError(""); }
    catch (error) { const message = getErrorMessage(error, "Unable to load address villages."); setLoadError(message); showErrorToast(message); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { loadData(); }, [loadData]);
  const columns = useMemo(() => [
    { accessorKey: "village_pcode", header: "Village P-Code", size: 180 },
    { accessorKey: "name", header: "Village", size: 230 },
    { accessorKey: "village_mya_mmr3", header: "Myanmar Name", size: 230 },
    { accessorKey: "village_tract", header: "Village Tract", size: 200 },
    { accessorKey: "description", header: "Description", size: 280 },
    { accessorKey: "is_blacklisted", header: "Blacklisted", size: 130 },
    { accessorKey: "created_by", header: "Created By", size: 160 },
    { accessorKey: "created_at", header: "Created Date", size: 180 },
  ], []);
  const save = async (values) => {
    setSaving(true);
    try {
      if (editData) await addressVillagesService.update(editData.uuid || editData.id, values);
      else await addressVillagesService.create(values);
      showSuccessToast(`Address Village ${editData ? "updated" : "created"}.`);
      setOpen(false); setEditData(null); await loadData();
    } catch (error) { showErrorToast(getErrorMessage(error, "Unable to save address village.")); }
    finally { setSaving(false); }
  };
  const remove = async () => {
    if (!deleteData) return;
    setSaving(true);
    try {
      await addressVillagesService.delete(deleteData.uuid || deleteData.id);
      showSuccessToast("Address Village deleted.");
      setDeleteData(null); await loadData();
    } catch (error) { showErrorToast(getErrorMessage(error, "Unable to delete address village.")); }
    finally { setSaving(false); }
  };
  const importFile = async (event) => {
    const file = event.target.files?.[0]; event.target.value = "";
    if (!file) return;
    setImporting(true);
    try {
      const result = await addressVillagesService.importFile(file); const payload = result?.data ?? result;
      showSuccessToast(Number.isFinite(payload?.rowCount) ? `Imported ${payload.rowCount} address village(s).` : "Address villages imported.");
      await loadData();
    } catch (error) { showErrorToast(getErrorMessage(error, "Unable to import address villages.")); }
    finally { setImporting(false); }
  };
  return (
    <Box sx={{ width: "100%" }}>
      <Typography component="h1" variant="h5" sx={{ mb: 2 }}>Address Village Management</Typography>
      {loadError && <Alert severity="error" sx={{ mb: 2 }}>{loadError}</Alert>}
      <Paper sx={{ width: "100%", p: 2 }}>
        <Table columns={columns} data={items} isLoading={loading}
          onCreate={() => { setEditData(null); setOpen(true); }}
          onEdit={(row) => { setEditData(row.original); setOpen(true); }}
          onDelete={(row) => setDeleteData(row.original)}
          createButtonLabel="Create Address Village" getRowId={(row) => row.uuid || String(row.id)}
          renderTopToolbarCustomActions={() => (
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button variant="contained" disabled={saving || importing} onClick={() => { setEditData(null); setOpen(true); }}>Create Address Village</Button>
              <Button variant="outlined" disabled={saving || importing} onClick={() => importRef.current?.click()}>{importing ? "Importing..." : "Import Excel"}</Button>
              <input ref={importRef} hidden type="file" accept=".xlsx,.xls,.csv" onChange={importFile} />
            </Box>
          )}
        />
      </Paper>
      <AddressVillageForm open={open} onClose={() => setOpen(false)} onSubmit={save} editData={editData} isLoading={saving} />
      <DeleteConfirmationModal isOpen={Boolean(deleteData)} onClose={() => !saving && setDeleteData(null)} onDelete={remove} isLoading={saving}
        title="Delete address village?" message={`Are you sure you want to delete "${deleteData?.name || ""}"? This action cannot be undone.`}
      />
    </Box>
  );
}
