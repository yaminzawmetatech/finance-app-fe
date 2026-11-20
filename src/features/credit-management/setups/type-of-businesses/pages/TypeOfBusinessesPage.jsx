import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Alert, Box, Button, Paper, Typography } from "@mui/material";
import Table from "../../../../../components/tables/Table";
import DeleteConfirmationModal from "../../../../../components/common/DeleteConfirmationModal";
import {
  showErrorToast,
  showSuccessToast,
} from "../../../../../components/common/ToastMessage";
import TypeOfBusinessForm from "../components/TypeOfBusinessForm";
import {
  createTypeOfBusiness,
  batchDeleteTypeOfBusinesses,
  deleteTypeOfBusiness,
  fetchTypeOfBusinesses,
  updateTypeOfBusiness,
} from "../store/typeOfBusinessesSlice";

const getErrorMessage = (error, fallback) => {
  if (typeof error === "string") return error;
  const message = error?.response?.data?.message ?? error?.message;
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

export default function TypeOfBusinessesPage() {
  const dispatch = useDispatch();
  const {
    items: typeOfBusinesses,
    isLoading,
    isSaving,
  } = useSelector((state) => state.typeOfBusinesses);
  const [formOpen, setFormOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  const [rowSelection, setRowSelection] = useState({});
  const [loadError, setLoadError] = useState("");

  const loadTypeOfBusinesses = useCallback(async () => {
    try {
      await dispatch(fetchTypeOfBusinesses()).unwrap();
      setLoadError("");
    } catch (error) {
      const message = getErrorMessage(
        error,
        "Unable to load types of business."
      );
      setLoadError(message);
      showErrorToast(message);
    }
  }, [dispatch]);

  useEffect(() => {
    let isMounted = true;

    dispatch(fetchTypeOfBusinesses())
      .unwrap()
      .then(() => {
        if (isMounted) setLoadError("");
      })
      .catch((error) => {
        if (!isMounted) return;
        const message = getErrorMessage(
          error,
          "Unable to load types of business."
        );
        setLoadError(message);
        showErrorToast(message);
      });

    return () => {
      isMounted = false;
    };
  }, [dispatch]);

  const columns = useMemo(
    () => [
      { accessorKey: "name", header: "Name", size: 240 },
      { accessorKey: "code", header: "Code", size: 180 },
      { accessorKey: "description", header: "Description", size: 300 },
      { accessorKey: "created_by", header: "Created By", size: 160 },
      { accessorKey: "created_at", header: "Created Date", size: 180 },
    ],
    []
  );

  const handleSave = async (values) => {
    try {
      if (editData) {
        await dispatch(
          updateTypeOfBusiness({
            uuid: editData.uuid || editData.id,
            data: values,
          })
        ).unwrap();
      } else {
        await dispatch(createTypeOfBusiness(values)).unwrap();
      }

      showSuccessToast(
        `Type of Business ${editData ? "updated" : "created"}.`
      );
      setFormOpen(false);
      setEditData(null);
      await loadTypeOfBusinesses();
    } catch (error) {
      showErrorToast(
        getErrorMessage(error, "Unable to save type of business.")
      );
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirmation) return;

    try {
      if (deleteConfirmation.type === "batch") {
        await dispatch(
          batchDeleteTypeOfBusinesses(deleteConfirmation.uuids)
        ).unwrap();
        showSuccessToast("Selected types of business deactivated.");
      } else {
        await dispatch(
          deleteTypeOfBusiness(
            deleteConfirmation.business.uuid || deleteConfirmation.business.id
          )
        ).unwrap();
        showSuccessToast("Type of Business deactivated.");
      }

      setDeleteConfirmation(null);
      setRowSelection({});
      await loadTypeOfBusinesses();
    } catch (error) {
      showErrorToast(
        getErrorMessage(error, "Unable to deactivate type(s) of business.")
      );
    }
  };

  const selectedCount = Object.keys(rowSelection).length;

  return (
    <Box sx={{ width: "100%" }}>
      <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
        Type of Business Management
      </Typography>
      {loadError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {loadError}
        </Alert>
      )}
      <Paper sx={{ width: "100%", p: 2 }}>
        <Table
          columns={columns}
          data={typeOfBusinesses}
          isLoading={isLoading}
          onCreate={() => {
            setEditData(null);
            setFormOpen(true);
          }}
          onEdit={(row) => {
            setEditData(row.original);
            setFormOpen(true);
          }}
          onDelete={(row) =>
            setDeleteConfirmation({
              type: "single",
              business: row.original,
            })
          }
          createButtonLabel="Create Type of Business"
          getRowId={(row) => row.uuid || String(row.id)}
          enableRowSelection
          positionToolbarAlertBanner="none"
          onRowSelectionChange={setRowSelection}
          state={{ rowSelection }}
          renderTopToolbarCustomActions={({ table }) => (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              <Button
                variant="contained"
                onClick={() => {
                  setEditData(null);
                  setFormOpen(true);
                }}
                disabled={isSaving}
              >
                Create Type of Business
              </Button>
              {selectedCount > 0 && (
                <Button
                  variant="outlined"
                  color="error"
                  disabled={isSaving}
                  onClick={() => {
                    const selectedRows = table.getSelectedRowModel().rows;
                    const uuids = selectedRows.map(
                      (row) => row.original.uuid
                    );
                    if (uuids.some((uuid) => !uuid)) {
                      showErrorToast(
                        "Cannot deactivate selected types of business: a selected item has no UUID."
                      );
                    } else if (uuids.length) {
                      setDeleteConfirmation({ type: "batch", uuids });
                    }
                  }}
                >
                  Deactivate Selected ({selectedCount})
                </Button>
              )}
            </Box>
          )}
        />
      </Paper>
      <TypeOfBusinessForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSave}
        editData={editData}
        isLoading={isSaving}
      />
      <DeleteConfirmationModal
        isOpen={Boolean(deleteConfirmation)}
        onClose={() => !isSaving && setDeleteConfirmation(null)}
        onDelete={handleDelete}
        isLoading={isSaving}
        title={
          deleteConfirmation?.type === "batch"
            ? "Deactivate selected types of business?"
            : "Deactivate type of business?"
        }
        message={
          deleteConfirmation?.type === "batch"
            ? `You are about to deactivate ${deleteConfirmation.uuids.length} type(s) of business.`
            : `Are you sure you want to deactivate "${deleteConfirmation?.business?.name || ""}"?`
        }
      />
    </Box>
  );
}
