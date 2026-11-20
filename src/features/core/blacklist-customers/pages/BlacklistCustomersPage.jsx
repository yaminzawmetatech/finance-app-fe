import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Alert, Box, Button, Paper, Typography } from "@mui/material";
import Table from "../../../../components/tables/Table";
import DeleteConfirmationModal from "../../../../components/common/DeleteConfirmationModal";
import {
  showErrorToast,
  showSuccessToast,
} from "../../../../components/common/ToastMessage";
import BlacklistCustomerForm from "../components/BlacklistCustomerForm";
import {
  batchDeleteBlacklistCustomers,
  createBlacklistCustomer,
  deleteBlacklistCustomer,
  fetchBlacklistCustomers,
  importBlacklistCustomers,
  updateBlacklistCustomer,
} from "../store/blacklistCustomersSlice";

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

export default function BlacklistCustomersPage() {
  const dispatch = useDispatch();
  const {
    items: customers,
    isLoading,
    isSaving,
    isImporting,
  } = useSelector((state) => state.blacklistCustomers);
  const [formOpen, setFormOpen] = useState(false);
  const [editCustomer, setEditCustomer] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  const [rowSelection, setRowSelection] = useState({});
  const [loadError, setLoadError] = useState("");
  const importInputRef = useRef(null);

  const loadCustomers = useCallback(async () => {
    try {
      await dispatch(fetchBlacklistCustomers()).unwrap();
      setLoadError("");
    } catch (error) {
      const message = getErrorMessage(
        error,
        "Unable to load blacklist customers."
      );
      setLoadError(message);
      showErrorToast(message);
    }
  }, [dispatch]);

  useEffect(() => {
    let active = true;
    dispatch(fetchBlacklistCustomers())
      .unwrap()
      .then(() => {
        if (active) setLoadError("");
      })
      .catch((error) => {
        if (!active) return;
        const message = getErrorMessage(
          error,
          "Unable to load blacklist customers."
        );
        setLoadError(message);
        showErrorToast(message);
      });

    return () => {
      active = false;
    };
  }, [dispatch]);

  const columns = useMemo(
    () => [
      {
        accessorKey: "black_list_customer_code",
        header: "Customer Code",
        size: 150,
      },
      {
        accessorKey: "black_list_customer_name",
        header: "Customer Name",
        size: 230,
      },
      { accessorKey: "father_name", header: "Father Name", size: 190 },
      { accessorKey: "full_nrc", header: "NRC", size: 200 },
      { accessorKey: "passport_no", header: "Passport No.", size: 150 },
      { accessorKey: "source", header: "Source", size: 160 },
      { accessorKey: "removal_type", header: "Removal Type", size: 160 },
      { accessorKey: "created_at", header: "Created Date", size: 180 },
    ],
    []
  );

  const openForm = (customer = null) => {
    setEditCustomer(customer);
    setFormOpen(true);
  };

  const handleSave = async (values) => {
    try {
      if (editCustomer) {
        await dispatch(
          updateBlacklistCustomer({
            uuid: editCustomer.uuid || editCustomer.id,
            data: values,
          })
        ).unwrap();
      } else {
        await dispatch(createBlacklistCustomer(values)).unwrap();
      }

      showSuccessToast(
        `Blacklist customer ${editCustomer ? "updated" : "created"}.`
      );
      setFormOpen(false);
      setEditCustomer(null);
      await loadCustomers();
    } catch (error) {
      showErrorToast(
        getErrorMessage(error, "Unable to save blacklist customer.")
      );
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirmation) return;

    try {
      if (deleteConfirmation.type === "batch") {
        await dispatch(
          batchDeleteBlacklistCustomers(deleteConfirmation.uuids)
        ).unwrap();
        showSuccessToast("Selected blacklist customers deleted.");
      } else {
        await dispatch(
          deleteBlacklistCustomer(
            deleteConfirmation.customer.uuid ||
              deleteConfirmation.customer.id
          )
        ).unwrap();
        showSuccessToast("Blacklist customer deleted.");
      }
      setDeleteConfirmation(null);
      setRowSelection({});
      await loadCustomers();
    } catch (error) {
      showErrorToast(
        getErrorMessage(error, "Unable to delete blacklist customer(s).")
      );
    }
  };

  const handleImport = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    try {
      const response = await dispatch(importBlacklistCustomers(file)).unwrap();
      const payload = response?.data ?? response;
      setRowSelection({});
      showSuccessToast(
        Number.isFinite(payload?.rowCount)
          ? `Imported ${payload.rowCount} blacklist customer(s).`
          : "Blacklist customers imported."
      );
      await loadCustomers();
    } catch (error) {
      showErrorToast(
        getErrorMessage(error, "Unable to import blacklist customers.")
      );
    }
  };

  const selectedCount = Object.keys(rowSelection).length;
  const isBusy = isSaving || isImporting;

  return (
    <Box sx={{ width: "100%" }}>
      <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
        Blacklist Customers
      </Typography>
      {loadError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {loadError}
        </Alert>
      )}
      <Paper sx={{ width: "100%", p: 2 }}>
        <Table
          columns={columns}
          data={customers}
          isLoading={isLoading}
          onCreate={() => openForm()}
          onEdit={(row) => openForm(row.original)}
          onDelete={(row) =>
            setDeleteConfirmation({
              type: "single",
              customer: row.original,
            })
          }
          createButtonLabel="Create Blacklist Customer"
          enableRowSelection
          positionToolbarAlertBanner="none"
          getRowId={(row) => row.uuid || String(row.id)}
          onRowSelectionChange={setRowSelection}
          state={{ rowSelection }}
          renderTopToolbarCustomActions={({ table }) => (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              <Button
                variant="contained"
                onClick={() => openForm()}
                disabled={isBusy}
              >
                Create Blacklist Customer
              </Button>
              <Button
                variant="outlined"
                onClick={() => importInputRef.current?.click()}
                disabled={isBusy}
              >
                {isImporting ? "Importing..." : "Import Excel"}
              </Button>
              {selectedCount > 0 && (
                <Button
                  variant="outlined"
                  color="error"
                  disabled={isBusy}
                  onClick={() => {
                    const selectedRows = table.getSelectedRowModel().rows;
                    const uuids = selectedRows.map((row) => row.original.uuid);
                    if (uuids.some((uuid) => !uuid)) {
                      showErrorToast(
                        "Cannot delete selected blacklist customers: a selected customer has no UUID."
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

      <BlacklistCustomerForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSave}
        editData={editCustomer}
        isLoading={isSaving}
      />

      <DeleteConfirmationModal
        isOpen={Boolean(deleteConfirmation)}
        onClose={() => !isBusy && setDeleteConfirmation(null)}
        onDelete={handleDelete}
        isLoading={isBusy}
        title={
          deleteConfirmation?.type === "batch"
            ? "Delete selected blacklist customers?"
            : "Delete blacklist customer?"
        }
        message={
          deleteConfirmation?.type === "batch"
            ? `You are about to delete ${deleteConfirmation.uuids.length} blacklist customer(s). This action cannot be undone.`
            : `Are you sure you want to delete "${deleteConfirmation?.customer?.black_list_customer_name || ""}"? This action cannot be undone.`
        }
      />
    </Box>
  );
}
