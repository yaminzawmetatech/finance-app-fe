import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";
import Table from "../../../components/tables/Table";
import DeleteConfirmationModal from "../../../components/common/DeleteConfirmationModal";
import {
  showErrorToast,
  showSuccessToast,
} from "../../../components/common/ToastMessage";
import nrcService from "../services/nrcService";

const getItems = (response) => {
  const payload = response?.data ?? response;
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
};

const getErrorMessage = (error, fallback) => {
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

const EMPTY_TOWNSHIP = {
  name: "",
  township_nrc_code: "",
  n_r_c_state_id: "",
  description: "",
};

export default function NrcTownshipPage() {
  const [townships, setTownships] = useState([]);
  const [states, setStates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editTownship, setEditTownship] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  const [rowSelection, setRowSelection] = useState({});
  const [isImporting, setIsImporting] = useState(false);
  const importInputRef = useRef(null);
  const [loadError, setLoadError] = useState("");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: EMPTY_TOWNSHIP });

  const loadTownships = useCallback(async () => {
    try {
      const response = await nrcService.getTownships();
      setTownships(getItems(response));
      setLoadError("");
    } catch (error) {
      const message = getErrorMessage(error, "Unable to load NRC townships.");
      setLoadError(message);
      showErrorToast(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadStates = useCallback(async () => {
    try {
      const response = await nrcService.getStates();
      setStates(getItems(response));
    } catch (error) {
      showErrorToast(getErrorMessage(error, "Unable to load NRC states."));
    }
  }, []);

  useEffect(() => {
    loadTownships();
  }, [loadTownships]);

  useEffect(() => {
    loadStates();
  }, [loadStates]);

  const columns = useMemo(
    () => [
      { accessorKey: "township_nrc_code", header: "Township Code", size: 170 },
      { accessorKey: "name", header: "Township Name", size: 220 },
      {
        accessorFn: (row) => row.n_r_c_state_name || row.nrc_state?.name || "",
        id: "state",
        header: "State",
        size: 200,
      },
      { accessorKey: "description", header: "Description", size: 300 },
    ],
    []
  );

  const openForm = (township = null) => {
    setEditTownship(township);
    reset(
      township
        ? {
            ...EMPTY_TOWNSHIP,
            ...township,
            n_r_c_state_id:
              township.n_r_c_state_id ?? township.nrc_state?.id ?? "",
            description:
              township.description === "---" ? "" : township.description || "",
          }
        : EMPTY_TOWNSHIP
    );
    setFormOpen(true);
  };

  const handleSave = async (values) => {
    setIsSaving(true);
    const payload = {
      ...values,
      name: values.name.trim(),
      township_nrc_code: values.township_nrc_code.trim(),
      n_r_c_state_id: Number(values.n_r_c_state_id),
      description: values.description.trim(),
    };

    try {
      if (editTownship) {
        await nrcService.updateTownship(
          editTownship.uuid || editTownship.id,
          payload
        );
      } else {
        await nrcService.createTownship(payload);
      }
      showSuccessToast(
        `NRC Township ${editTownship ? "updated" : "created"}.`
      );
      setFormOpen(false);
      setEditTownship(null);
      await loadTownships();
    } catch (error) {
      showErrorToast(getErrorMessage(error, "Unable to save NRC township."));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirmation) return;
    setIsSaving(true);
    try {
      if (deleteConfirmation.type === "batch") {
        await nrcService.batchDeleteTownships(deleteConfirmation.uuids);
        showSuccessToast("Selected NRC townships deleted.");
      } else {
        await nrcService.deleteTownship(
          deleteConfirmation.township.uuid ||
            deleteConfirmation.township.id
        );
        showSuccessToast("NRC Township deleted.");
      }
      setDeleteConfirmation(null);
      setRowSelection({});
      await loadTownships();
    } catch (error) {
      showErrorToast(
        getErrorMessage(error, "Unable to delete selected NRC townships.")
      );
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
      const response = await nrcService.importTownships(file);
      const payload = response?.data ?? response;
      const rowCount = payload?.rowCount;
      setRowSelection({});
      showSuccessToast(
        Number.isFinite(rowCount)
          ? `Imported ${rowCount} NRC township(s).`
          : "NRC townships imported."
      );
      await loadTownships();
    } catch (error) {
      showErrorToast(getErrorMessage(error, "Unable to import NRC townships."));
    } finally {
      setIsImporting(false);
    }
  };

  const selectedCount = Object.keys(rowSelection).length;

  return (
    <Box sx={{ width: "100%" }}>
      <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
        NRC Townships
      </Typography>
      {loadError && <Alert severity="error" sx={{ mb: 2 }}>{loadError}</Alert>}
      <Paper sx={{ width: "100%", p: 2 }}>
        <Table
          columns={columns}
          data={townships}
          isLoading={isLoading}
          onCreate={() => openForm()}
          onEdit={(row) => openForm(row.original)}
          onDelete={(row) =>
            setDeleteConfirmation({ type: "single", township: row.original })
          }
          createButtonLabel="Create NRC Township"
          enableRowSelection
          positionToolbarAlertBanner="none"
          getRowId={(row) => row.uuid || String(row.id)}
          onRowSelectionChange={setRowSelection}
          state={{ rowSelection }}
          renderTopToolbarCustomActions={({ table }) => (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              <Button variant="contained"               onClick={() => openForm()}
              disabled={isSaving || isImporting}>
                Create NRC Township
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
                        "Cannot delete selected NRC townships: a selected township has no UUID."
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

      <Dialog
        open={formOpen}
        onClose={() => !isSaving && setFormOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {editTownship ? "Edit NRC Township" : "Create NRC Township"}
        </DialogTitle>
        <Box component="form" onSubmit={handleSubmit(handleSave)}>
          <DialogContent sx={{ display: "grid", gap: 2, pt: 1 }}>
            <TextField
              select
              label="State"
              defaultValue=""
              {...register("n_r_c_state_id", {
                required: "State is required.",
                setValueAs: (value) => (value === "" ? "" : Number(value)),
              })}
              error={Boolean(errors.n_r_c_state_id)}
              helperText={errors.n_r_c_state_id?.message}
            >
              {states.map((state) => (
                <MenuItem key={state.id} value={state.id}>
                  {state.name} ({state.state_code})
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Township Name"
              {...register("name", { required: "Township name is required." })}
              error={Boolean(errors.name)}
              helperText={errors.name?.message}
            />
            <TextField
              label="Township NRC Code"
              {...register("township_nrc_code", {
                required: "Township NRC code is required.",
              })}
              error={Boolean(errors.township_nrc_code)}
              helperText={errors.township_nrc_code?.message}
            />
            <TextField label="Description" {...register("description")} />
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setFormOpen(false)} disabled={isSaving}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={isSaving}>
              {isSaving
                ? "Saving..."
                : editTownship
                  ? "Save Changes"
                  : "Create"}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      <DeleteConfirmationModal
        isOpen={Boolean(deleteConfirmation)}
        onClose={() => setDeleteConfirmation(null)}
        onDelete={handleDelete}
        isLoading={isSaving}
        title={
          deleteConfirmation?.type === "batch"
            ? "Delete selected NRC townships?"
            : "Delete NRC township?"
        }
        message={
          deleteConfirmation?.type === "batch"
            ? `You are about to delete ${deleteConfirmation.uuids.length} NRC township(s). This action cannot be undone.`
            : `Are you sure you want to delete "${deleteConfirmation?.township?.name || ""}"? This action cannot be undone.`
        }
      />
    </Box>
  );
}
