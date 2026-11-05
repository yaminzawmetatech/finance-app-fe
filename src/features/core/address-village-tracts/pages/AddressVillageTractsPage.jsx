import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Alert, Box, Button, Paper, Typography } from "@mui/material";
import Table from "../../../../components/tables/Table";
import DeleteConfirmationModal from "../../../../components/common/DeleteConfirmationModal";
import { showErrorToast, showSuccessToast } from "../../../../components/common/ToastMessage";
import AddressVillageTractForm from "../components/AddressVillageTractForm";
import addressVillageTractsService from "../services/addressVillageTractsService";

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

export default function AddressVillageTractsPage() {
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
    try { setItems(getItems(await addressVillageTractsService.getAll())); setLoadError(""); }
    catch (error) { const message = getErrorMessage(error, "Unable to load address village tracts."); setLoadError(message); showErrorToast(message); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { loadData(); }, [loadData]);
  const columns = useMemo(() => [
    { accessorKey: "vt_pcode", header: "Village Tract P-Code", size: 190 },
    { accessorKey: "name", header: "Village Tract", size: 240 },
    { accessorKey: "village_tract_mya_mm3", header: "Myanmar Name", size: 240 },
    { accessorKey: "township", header: "Township", size: 220 },
    { accessorKey: "description", header: "Description", size: 280 },
    { accessorKey: "is_blacklisted", header: "Blacklisted", size: 130 },
    { accessorKey: "created_by", header: "Created By", size: 160 },
  ], []);
  const save = async (values) => {
    setSaving(true);
    try {
      if (editData) await addressVillageTractsService.update(editData.uuid || editData.id, values);
      else await addressVillageTractsService.create(values);
      showSuccessToast(`Address Village Tract ${editData ? "updated" : "created"}.`);
      setOpen(false); setEditData(null); await loadData();
    } catch (error) { showErrorToast(getErrorMessage(error, "Unable to save address village tract.")); }
    finally { setSaving(false); }
  };
  const remove = async () => {
    if (!deleteData) return;
    setSaving(true);
    try {
      await addressVillageTractsService.delete(deleteData.uuid || deleteData.id);
      showSuccessToast("Address Village Tract deleted.");
      setDeleteData(null); await loadData();
    } catch (error) { showErrorToast(getErrorMessage(error, "Unable to delete address village tract.")); }
    finally { setSaving(false); }
  };
  const importFile = async (event) => {
    const file = event.target.files?.[0]; event.target.value = "";
    if (!file) return;
    setImporting(true);
    try {
      const result = await addressVillageTractsService.importFile(file); const payload = result?.data ?? result;
      showSuccessToast(Number.isFinite(payload?.rowCount) ? `Imported ${payload.rowCount} address village tract(s).` : "Address village tracts imported.");
      await loadData();
    } catch (error) { showErrorToast(getErrorMessage(error, "Unable to import address village tracts.")); }
    finally { setImporting(false); }
  };
  return (
    <Box sx={{ width: "100%" }}>
      <Typography component="h1" variant="h5" sx={{ mb: 2 }}>Address Village Tract Management</Typography>
      {loadError && <Alert severity="error" sx={{ mb: 2 }}>{loadError}</Alert>}
      <Paper sx={{ width: "100%", p: 2 }}>
        <Table columns={columns} data={items} isLoading={loading}
          onCreate={() => { setEditData(null); setOpen(true); }}
          onEdit={(row) => { setEditData(row.original); setOpen(true); }}
          onDelete={(row) => setDeleteData(row.original)}
          createButtonLabel="Create Address Village Tract" getRowId={(row) => row.uuid || String(row.id)}
          renderTopToolbarCustomActions={() => (
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button variant="contained" disabled={saving || importing} onClick={() => { setEditData(null); setOpen(true); }}>Create Address Village Tract</Button>
              <Button variant="outlined" disabled={saving || importing} onClick={() => importRef.current?.click()}>{importing ? "Importing..." : "Import Excel"}</Button>
              <input ref={importRef} hidden type="file" accept=".xlsx,.xls,.csv" onChange={importFile} />
            </Box>
          )}
        />
      </Paper>
      <AddressVillageTractForm open={open} onClose={() => setOpen(false)} onSubmit={save} editData={editData} isLoading={saving} />
      <DeleteConfirmationModal isOpen={Boolean(deleteData)} onClose={() => !saving && setDeleteData(null)} onDelete={remove} isLoading={saving}
        title="Delete address village tract?" message={`Are you sure you want to delete "${deleteData?.name || ""}"? This action cannot be undone.`}
      />
    </Box>
  );
}
