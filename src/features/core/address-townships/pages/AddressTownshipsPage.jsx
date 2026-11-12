import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Alert, Box, Button, Paper, Typography } from "@mui/material";
import Table from "../../../../components/tables/Table";
import DeleteConfirmationModal from "../../../../components/common/DeleteConfirmationModal";
import { showErrorToast, showSuccessToast } from "../../../../components/common/ToastMessage";
import AddressTownshipForm from "../components/AddressTownshipForm";
import {
  batchDeleteAddressTownships,
  createAddressTownship,
  deleteAddressTownship,
  fetchAddressTownships,
  importAddressTownships,
  updateAddressTownship,
} from "../store/addressTownshipsSlice";
const getErrorMessage = (error, fallback) => {
  if (typeof error === "string") return error;
  const message = error.response?.data?.message ?? error.message;
  if (typeof message === "string") return message;
  if (message && typeof message === "object") return Object.entries(message).flatMap(([field, errors]) => (Array.isArray(errors) ? errors : [errors]).map((item) => `${field}: ${item}`)).join("\n");
  return fallback;
};

export default function AddressTownshipsPage() {
  const dispatch = useDispatch();
  const {
    items,
    isLoading: loading,
    isSaving: saving,
    isImporting: importing,
  } = useSelector((state) => state.addressTownships);
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteData, setDeleteData] = useState(null);
  const [selection, setSelection] = useState({});
  const [loadError, setLoadError] = useState("");
  const importRef = useRef(null);
  const loadData = useCallback(async () => {
    try { await dispatch(fetchAddressTownships()).unwrap(); setLoadError(""); }
    catch (error) { const message = getErrorMessage(error, "Unable to load address townships."); setLoadError(message); showErrorToast(message); }
  }, [dispatch]);
  useEffect(() => { loadData(); }, [loadData]);
  const columns = useMemo(() => [
    { accessorKey: "ts_pcode", header: "Township P-Code", size: 180 },
    { accessorKey: "name", header: "Township", size: 220 },
    { accessorKey: "township_mya_mm3", header: "Myanmar Name", size: 230 },
    { accessorKey: "state", header: "State / Region", size: 200 },
    { accessorKey: "district", header: "District", size: 200 },
    { accessorKey: "description", header: "Description", size: 280 },
    { accessorKey: "is_blacklisted", header: "Blacklisted", size: 130 },
    { accessorKey: "created_by", header: "Created By", size: 160 },
    { accessorKey: "created_at", header: "Created Date", size: 180 },
  ], []);
  const save = async (values) => {
    try {
      if (editData) {
        await dispatch(updateAddressTownship({
          uuid: editData.uuid || editData.id,
          data: values,
        })).unwrap();
      } else {
        await dispatch(createAddressTownship(values)).unwrap();
      }
      showSuccessToast(`Address Township ${editData ? "updated" : "created"}.`);
      setOpen(false); setEditData(null); await loadData();
    } catch (error) { showErrorToast(getErrorMessage(error, "Unable to save address township.")); }
  };
  const remove = async () => {
    if (!deleteData) return;
    try {
      if (deleteData.type === "batch") { await dispatch(batchDeleteAddressTownships(deleteData.uuids)).unwrap(); showSuccessToast("Selected address townships deleted."); }
      else { await dispatch(deleteAddressTownship(deleteData.item.uuid || deleteData.item.id)).unwrap(); showSuccessToast("Address Township deleted."); }
      setDeleteData(null); setSelection({}); await loadData();
    } catch (error) { showErrorToast(getErrorMessage(error, "Unable to delete address townships.")); }
  };
  const importFile = async (event) => {
    const file = event.target.files?.[0]; event.target.value = "";
    if (!file) return;
    try {
      const result = await dispatch(importAddressTownships(file)).unwrap(); const payload = result?.data ?? result;
      showSuccessToast(Number.isFinite(payload?.rowCount) ? `Imported ${payload.rowCount} address township(s).` : "Address townships imported.");
      await loadData();
    } catch (error) { showErrorToast(getErrorMessage(error, "Unable to import address townships.")); }
  };
  const selectedCount = Object.keys(selection).length;
  return (
    <Box sx={{ width: "100%" }}>
      <Typography component="h1" variant="h5" sx={{ mb: 2 }}>Address Township Management</Typography>
      {loadError && <Alert severity="error" sx={{ mb: 2 }}>{loadError}</Alert>}
      <Paper sx={{ width: "100%", p: 2 }}>
        <Table columns={columns} data={items} isLoading={loading}
          onCreate={() => { setEditData(null); setOpen(true); }}
          onEdit={(row) => { setEditData(row.original); setOpen(true); }}
          onDelete={(row) => setDeleteData({ type: "single", item: row.original })}
          createButtonLabel="Create Address Township" enableRowSelection
          positionToolbarAlertBanner="none" getRowId={(row) => row.uuid || String(row.id)}
          onRowSelectionChange={setSelection} state={{ rowSelection: selection }}
          renderTopToolbarCustomActions={({ table }) => (
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              <Button variant="contained" disabled={saving || importing} onClick={() => { setEditData(null); setOpen(true); }}>Create Address Township</Button>
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
      <AddressTownshipForm open={open} onClose={() => setOpen(false)} onSubmit={save} editData={editData} isLoading={saving} />
      <DeleteConfirmationModal isOpen={Boolean(deleteData)} onClose={() => !saving && setDeleteData(null)} onDelete={remove} isLoading={saving}
        title={deleteData?.type === "batch" ? "Delete selected address townships?" : "Delete address township?"}
        message={deleteData?.type === "batch" ? `You are about to delete ${deleteData.uuids.length} record(s). This action cannot be undone.` : `Are you sure you want to delete "${deleteData?.item?.name || ""}"? This action cannot be undone.`}
      />
    </Box>
  );
}
