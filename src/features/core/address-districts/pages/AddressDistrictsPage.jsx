import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Alert, Box, Button, Paper, Typography } from "@mui/material";
import Table from "../../../../components/tables/Table";
import DeleteConfirmationModal from "../../../../components/common/DeleteConfirmationModal";
import { showErrorToast, showSuccessToast } from "../../../../components/common/ToastMessage";
import AddressDistrictForm from "../components/AddressDistrictForm";
import {
  batchDeleteAddressDistricts,
  createAddressDistrict,
  deleteAddressDistrict,
  fetchAddressDistricts,
  importAddressDistricts,
  updateAddressDistrict,
} from "../store/addressDistrictsSlice";

const getErrorMessage = (error, fallback) => {
  if (typeof error === "string") return error;
  const message = error.response?.data?.message ?? error.message;
  if (typeof message === "string") return message;
  if (message && typeof message === "object") {
    return Object.entries(message).flatMap(([field, errors]) =>
      (Array.isArray(errors) ? errors : [errors]).map((item) => `${field}: ${item}`)
    ).join("\n");
  }
  return fallback;
};

export default function AddressDistrictsPage() {
  const dispatch = useDispatch();
  const {
    items: districts,
    isLoading,
    isSaving,
    isImporting,
  } = useSelector((state) => state.addressDistricts);
  const [formOpen, setFormOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteData, setDeleteData] = useState(null);
  const [selection, setSelection] = useState({});
  const [loadError, setLoadError] = useState("");
  const importRef = useRef(null);
  const loadData = useCallback(async () => {
    try {
      await dispatch(fetchAddressDistricts()).unwrap();
      setLoadError("");
    } catch (error) {
      const message = getErrorMessage(error, "Unable to load address districts.");
      setLoadError(message);
      showErrorToast(message);
    }
  }, [dispatch]);
  useEffect(() => { loadData(); }, [loadData]);
  const columns = useMemo(() => [
    { accessorKey: "district_code", header: "District P-Code", size: 180 },
    { accessorKey: "name", header: "District", size: 220 },
    { accessorKey: "district_mya_mm3", header: "Myanmar Name", size: 230 },
    { accessorKey: "address_state", header: "State / Region", size: 220 },
    { accessorKey: "description", header: "Description", size: 300 },
    { accessorKey: "is_blacklisted", header: "Blacklisted", size: 130 },
    { accessorKey: "created_by", header: "Created By", size: 160 },
    { accessorKey: "created_at", header: "Created Date", size: 180 },
  ], []);
  const save = async (values) => {
    try {
      if (editData) {
        await dispatch(updateAddressDistrict({
          uuid: editData.uuid || editData.id,
          data: values,
        })).unwrap();
      } else {
        await dispatch(createAddressDistrict(values)).unwrap();
      }
      showSuccessToast(`Address District ${editData ? "updated" : "created"}.`);
      setFormOpen(false); setEditData(null); await loadData();
    } catch (error) {
      showErrorToast(getErrorMessage(error, "Unable to save address district."));
    }
  };
  const remove = async () => {
    if (!deleteData) return;
    try {
      if (deleteData.type === "batch") {
        await dispatch(batchDeleteAddressDistricts(deleteData.uuids)).unwrap();
        showSuccessToast("Selected address districts deleted.");
      } else {
        await dispatch(deleteAddressDistrict(
          deleteData.item.uuid || deleteData.item.id
        )).unwrap();
        showSuccessToast("Address District deleted.");
      }
      setDeleteData(null); setSelection({}); await loadData();
    } catch (error) {
      showErrorToast(getErrorMessage(error, "Unable to delete address districts."));
    }
  };
  const importFile = async (event) => {
    const file = event.target.files?.[0]; event.target.value = "";
    if (!file) return;
    try {
      const result = await dispatch(importAddressDistricts(file)).unwrap();
      const payload = result?.data ?? result;
      showSuccessToast(Number.isFinite(payload?.rowCount) ? `Imported ${payload.rowCount} address district(s).` : "Address districts imported.");
      await loadData();
    } catch (error) {
      showErrorToast(getErrorMessage(error, "Unable to import address districts."));
    }
  };
  const selectedCount = Object.keys(selection).length;
  return (
    <Box sx={{ width: "100%" }}>
      <Typography component="h1" variant="h5" sx={{ mb: 2 }}>Address District Management</Typography>
      {loadError && <Alert severity="error" sx={{ mb: 2 }}>{loadError}</Alert>}
      <Paper sx={{ width: "100%", p: 2 }}>
        <Table
          columns={columns} data={districts} isLoading={isLoading}
          onCreate={() => { setEditData(null); setFormOpen(true); }}
          onEdit={(row) => { setEditData(row.original); setFormOpen(true); }}
          onDelete={(row) => setDeleteData({ type: "single", item: row.original })}
          createButtonLabel="Create Address District"
          enableRowSelection positionToolbarAlertBanner="none"
          getRowId={(row) => row.uuid || String(row.id)}
          onRowSelectionChange={setSelection} state={{ rowSelection: selection }}
          renderTopToolbarCustomActions={({ table }) => (
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              <Button variant="contained" disabled={isSaving || isImporting} onClick={() => { setEditData(null); setFormOpen(true); }}>Create Address District</Button>
              <Button variant="outlined" disabled={isSaving || isImporting} onClick={() => importRef.current?.click()}>{isImporting ? "Importing..." : "Import Excel"}</Button>
              {selectedCount > 0 && <Button variant="outlined" color="error" disabled={isSaving || isImporting} onClick={() => {
                const uuids = table.getSelectedRowModel().rows.map((row) => row.original.uuid);
                if (uuids.some((uuid) => !uuid)) showErrorToast("Cannot batch delete records without UUIDs.");
                else setDeleteData({ type: "batch", uuids });
              }}>Delete Selected ({selectedCount})</Button>}
              <input ref={importRef} hidden type="file" accept=".xlsx,.xls,.csv" onChange={importFile} />
            </Box>
          )}
        />
      </Paper>
      <AddressDistrictForm open={formOpen} onClose={() => setFormOpen(false)} onSubmit={save} editData={editData} isLoading={isSaving} />
      <DeleteConfirmationModal
        isOpen={Boolean(deleteData)} onClose={() => !isSaving && setDeleteData(null)}
        onDelete={remove} isLoading={isSaving}
        title={deleteData?.type === "batch" ? "Delete selected address districts?" : "Delete address district?"}
        message={deleteData?.type === "batch" ? `You are about to delete ${deleteData.uuids.length} record(s). This action cannot be undone.` : `Are you sure you want to delete "${deleteData?.item?.name || ""}"? This action cannot be undone.`}
      />
    </Box>
  );
}
