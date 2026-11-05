import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Alert, Box, Button, Paper, Typography } from "@mui/material";
import Table from "../../../../components/tables/Table";
import DeleteConfirmationModal from "../../../../components/common/DeleteConfirmationModal";
import { showErrorToast, showSuccessToast } from "../../../../components/common/ToastMessage";
import AddressCityForm from "../components/AddressCityForm";
import addressCitiesService from "../services/addressCitiesService";

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

export default function AddressCitiesPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [importing, setImporting] = useState(false);
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteData, setDeleteData] = useState(null);
  const [selection, setSelection] = useState({});
  const [loadError, setLoadError] = useState("");
  const importRef = useRef(null);
  const loadData = useCallback(async () => {
    try { setItems(getItems(await addressCitiesService.getAll())); setLoadError(""); }
    catch (error) { const message = getErrorMessage(error, "Unable to load address cities."); setLoadError(message); showErrorToast(message); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { loadData(); }, [loadData]);
  const columns = useMemo(() => [
    { accessorKey: "town_pcode", header: "Town P-Code", size: 170 },
    { accessorKey: "name", header: "City / Town", size: 230 },
    { accessorKey: "city_mya_mm3", header: "Myanmar Name", size: 230 },
    { accessorKey: "township", header: "Township", size: 200 },
    { accessorKey: "description", header: "Description", size: 280 },
    { accessorKey: "is_blacklisted", header: "Blacklisted", size: 130 },
    { accessorKey: "created_by", header: "Created By", size: 160 },
    { accessorKey: "created_at", header: "Created Date", size: 180 },
  ], []);
  const save = async (values) => {
    setSaving(true);
    try {
      if (editData) await addressCitiesService.update(editData.uuid || editData.id, values);
      else await addressCitiesService.create(values);
      showSuccessToast(`Address City ${editData ? "updated" : "created"}.`);
      setOpen(false); setEditData(null); await loadData();
    } catch (error) { showErrorToast(getErrorMessage(error, "Unable to save address city.")); }
    finally { setSaving(false); }
  };
  const remove = async () => {
    if (!deleteData) return;
    setSaving(true);
    try {
      if (deleteData.type === "batch") { await addressCitiesService.batchDelete(deleteData.uuids); showSuccessToast("Selected address cities deleted."); }
      else { await addressCitiesService.delete(deleteData.item.uuid || deleteData.item.id); showSuccessToast("Address City deleted."); }
      setDeleteData(null); setSelection({}); await loadData();
    } catch (error) { showErrorToast(getErrorMessage(error, "Unable to delete address cities.")); }
    finally { setSaving(false); }
  };
  const importFile = async (event) => {
    const file = event.target.files?.[0]; event.target.value = "";
    if (!file) return;
    setImporting(true);
    try {
      const result = await addressCitiesService.importFile(file); const payload = result?.data ?? result;
      showSuccessToast(Number.isFinite(payload?.rowCount) ? `Imported ${payload.rowCount} address city record(s).` : "Address cities imported.");
      await loadData();
    } catch (error) { showErrorToast(getErrorMessage(error, "Unable to import address cities.")); }
    finally { setImporting(false); }
  };
  const selectedCount = Object.keys(selection).length;
  return (
    <Box sx={{ width: "100%" }}>
      <Typography component="h1" variant="h5" sx={{ mb: 2 }}>Address City Management</Typography>
      {loadError && <Alert severity="error" sx={{ mb: 2 }}>{loadError}</Alert>}
      <Paper sx={{ width: "100%", p: 2 }}>
        <Table columns={columns} data={items} isLoading={loading}
          onCreate={() => { setEditData(null); setOpen(true); }}
          onEdit={(row) => { setEditData(row.original); setOpen(true); }}
          onDelete={(row) => setDeleteData({ type: "single", item: row.original })}
          createButtonLabel="Create Address City" enableRowSelection
          positionToolbarAlertBanner="none" getRowId={(row) => row.uuid || String(row.id)}
          onRowSelectionChange={setSelection} state={{ rowSelection: selection}}
          renderTopToolbarCustomActions={({ table }) => (
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              <Button variant="contained" disabled={saving || importing} onClick={() => { setEditData(null); setOpen(true); }}>Create Address City</Button>
              <Button variant="outlined" disabled={saving || importing} onClick={() => importRef.current?.click()}>{importing ? "Importing..." : "Import Excel"}</Button>
              {selectedCount > 0 && <Button variant="outlined" color="error" disabled={saving || importing} onClick={() => {
                const uuids = table.getSelectedRowModel().rows.map((row) => row.original.uuid);
                if (uuids.some((uuid) => !uuid)) showErrorToast("Cannot batch delete records without UUIDs.");
                else setDeleteData({ type: "batch", uuids });
              }}>Delete Selected ({selectedCount})</Button>}
              <input ref={importRef} hidden type="file" accept=".xlsx,.xls,.csv" onChange={importFile} />
            </Box>
          )}
        />
      </Paper>
      <AddressCityForm open={open} onClose={() => setOpen(false)} onSubmit={save} editData={editData} isLoading={saving} />
      <DeleteConfirmationModal isOpen={Boolean(deleteData)} onClose={() => !saving && setDeleteData(null)} onDelete={remove} isLoading={saving}
        title={deleteData?.type === "batch" ? "Delete selected address cities?" : "Delete address city?"}
        message={deleteData?.type === "batch" ? `You are about to delete ${deleteData.uuids.length} record(s). This action cannot be undone.` : `Are you sure you want to delete "${deleteData?.item?.name || ""}"? This action cannot be undone.`}
      />
    </Box>
  );
}
