import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Alert,
  Box,
  Button,
  Paper,
  Typography,
} from "@mui/material";
import Table from "../../../../components/tables/Table";
import DeleteConfirmationModal from "../../../../components/common/DeleteConfirmationModal";
import NrcStateForm from "../components/NrcStateForm";
import {
  showErrorToast,
  showSuccessToast,
} from "../../../../components/common/ToastMessage";
import {
  batchDeleteNrcStates,
  createNrcState,
  deleteNrcState,
  fetchNrcStates,
  importNrcStates,
  updateNrcState,
} from "../store/nrcStatesSlice";

const getErrorMessage = (error, fallback) => {
  if (typeof error === "string") return error;
  const message = error.response?.data?.message ?? error.message;
  if (typeof message === "string") return message;
  if (message && typeof message === "object") {
    return Object.entries(message)
      .flatMap(([field, errors]) =>
        (Array.isArray(errors) ? errors : [errors]).map(
          (item) => `${field}: ${item}`
        )
      )
      .join("\n");
  }
  return fallback;
};

export default function NrcStatePage() {
  const dispatch = useDispatch();
  const {
    items: states,
    isLoading,
    isSaving,
    isImporting,
  } = useSelector((state) => state.nrcStates);
  const [formOpen, setFormOpen] = useState(false);
  const [editState, setEditState] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  const [rowSelection, setRowSelection] = useState({});
  const importInputRef = useRef(null);
  const [loadError, setLoadError] = useState("");
  const loadStates = useCallback(async () => {
    try {
      await dispatch(fetchNrcStates()).unwrap();
      setLoadError("");
    } catch (error) {
      const message = getErrorMessage(error, "Unable to load NRC states.");
      setLoadError(message);
      showErrorToast(message);
    }
  }, [dispatch]);

  useEffect(() => {
    loadStates();
  }, [loadStates]);

  const columns = useMemo(
    () => [
      { accessorKey: "state_code", header: "State Code", size: 150 },
      { accessorKey: "name", header: "State Name", size: 220 },
      { accessorKey: "description", header: "Description", size: 360 },
    ],
    []
  );

  const openForm = (state = null) => {
    setEditState(state);
    setFormOpen(true);
  };

  const handleSave = async ({ name, state_code, description }) => {
    const payload = {
      name: name.trim(),
      state_code: Number(state_code),
      description: description.trim(),
    };

    try {
      if (editState) {
        await dispatch(updateNrcState({
          uuid: editState.uuid || editState.id,
          data: payload,
        })).unwrap();
      } else {
        await dispatch(createNrcState(payload)).unwrap();
      }
      showSuccessToast(
        `NRC State ${editState ? "updated" : "created"}.`
      );
      setFormOpen(false);
      setEditState(null);
      await loadStates();
    } catch (error) {
      showErrorToast(getErrorMessage(error, "Unable to save NRC state."));
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirmation) return;
    try {
      if (deleteConfirmation.type === "batch") {
        await dispatch(batchDeleteNrcStates(deleteConfirmation.uuids)).unwrap();
        showSuccessToast("Selected NRC states deleted.");
      } else {
        await dispatch(deleteNrcState(
          deleteConfirmation.state.uuid || deleteConfirmation.state.id
        )).unwrap();
        showSuccessToast("NRC State deleted.");
      }
      setDeleteConfirmation(null);
      setRowSelection({});
      await loadStates();
    } catch (error) {
      showErrorToast(
        getErrorMessage(error, "Unable to delete selected NRC states.")
      );
    }
  };

  const handleImport = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    try {
      const response = await dispatch(importNrcStates(file)).unwrap();
      const payload = response?.data ?? response;
      const rowCount = payload?.rowCount;
      setRowSelection({});
      showSuccessToast(
        Number.isFinite(rowCount)
          ? `Imported ${rowCount} NRC state(s).`
          : "NRC states imported."
      );
      await loadStates();
    } catch (error) {
      showErrorToast(getErrorMessage(error, "Unable to import NRC states."));
    }
  };

  const selectedCount = Object.keys(rowSelection).length;

  return (
    <Box sx={{ width: "100%" }}>
      <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
        NRC States
      </Typography>
      {loadError && <Alert severity="error" sx={{ mb: 2 }}>{loadError}</Alert>}
      <Paper sx={{ width: "100%", p: 2 }}>
        <Table
          columns={columns}
          data={states}
          isLoading={isLoading}
          onCreate={() => openForm()}
          onEdit={(row) => openForm(row.original)}
          onDelete={(row) =>
            setDeleteConfirmation({ type: "single", state: row.original })
          }
          createButtonLabel="Create NRC State"
          enableRowSelection
          positionToolbarAlertBanner="none"
          getRowId={(row) => row.uuid || String(row.id)}
          onRowSelectionChange={setRowSelection}
          state={{ rowSelection }}
          renderTopToolbarCustomActions={({ table }) => (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              <Button variant="contained"               onClick={() => openForm()}
              disabled={isSaving || isImporting}>
                Create NRC State
              </Button>
              <Button
                variant="outlined"
                onClick={() => importInputRef.current?.click()}
                disabled={isImporting || isSaving}
              >
                {isImporting ? "Importing..." : "Import Excel"}
              </Button>
              {selectedCount > 0 && (
                <Button
                  variant="outlined"
                  color="error"
                  disabled={isSaving || isImporting}
                  onClick={() => {
                    const selectedRows = table.getSelectedRowModel().rows;
                    const uuids = selectedRows.map((row) => row.original.uuid);
                    if (uuids.some((uuid) => !uuid)) {
                      showErrorToast(
                        "Cannot delete selected NRC states: a selected state has no UUID."
                      );
                    } else if (uuids.length) {
                      setDeleteConfirmation({ type: "batch", uuids });
                    }
                  }}
                >
                  Delete Selected ({selectedCount})
                </Button>
              )}
              <input
                ref={importInputRef}
                hidden
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleImport}
              />
            </Box>
          )}
        />
      </Paper>

      <NrcStateForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSave}
        editData={editState}
        isLoading={isSaving}
      />

      <DeleteConfirmationModal
        isOpen={Boolean(deleteConfirmation)}
        onClose={() => setDeleteConfirmation(null)}
        onDelete={handleDelete}
        isLoading={isSaving}
        title={
          deleteConfirmation?.type === "batch"
            ? "Delete selected NRC states?"
            : "Delete NRC state?"
        }
        message={
          deleteConfirmation?.type === "batch"
            ? `You are about to delete ${deleteConfirmation.uuids.length} NRC state(s). This action cannot be undone.`
            : `Are you sure you want to delete "${deleteConfirmation?.state?.name || ""}"? This action cannot be undone.`
        }
      />
    </Box>
  );
}
