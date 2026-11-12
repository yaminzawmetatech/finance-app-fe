import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Alert, Box, Button, Paper, Typography } from "@mui/material";
import Table from "../../../../components/tables/Table";
import DeleteConfirmationModal from "../../../../components/common/DeleteConfirmationModal";
import {
  showErrorToast,
  showSuccessToast,
} from "../../../../components/common/ToastMessage";
import TableForm from "../components/TableForm";
import {
  batchDeleteTables,
  createTable,
  deleteTable,
  fetchTables,
  updateTable,
} from "../store/tablesSlice";

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

export default function TablesPage() {
  const dispatch = useDispatch();
  const { items: tables, isLoading, isSaving } = useSelector(
    (state) => state.tables
  );
  const [formOpen, setFormOpen] = useState(false);
  const [editTable, setEditTable] = useState(null);
  const [deleteData, setDeleteData] = useState(null);
  const [rowSelection, setRowSelection] = useState({});
  const [loadError, setLoadError] = useState("");

  const loadTables = useCallback(async () => {
    try {
      await dispatch(fetchTables()).unwrap();
      setLoadError("");
    } catch (error) {
      const message = getErrorMessage(error, "Unable to load tables.");
      setLoadError(message);
      showErrorToast(message);
    }
  }, [dispatch]);

  useEffect(() => {
    loadTables();
  }, [loadTables]);

  const columns = useMemo(
    () => [
      { accessorKey: "name", header: "Table Name", size: 260 },
      { accessorKey: "description", header: "Description", size: 360 },
      { accessorKey: "created_by", header: "Created By", size: 170 },
      { accessorKey: "created_at", header: "Created Date", size: 180 },
      { accessorKey: "modified_by", header: "Modified By", size: 170 },
      { accessorKey: "last_modified", header: "Last Modified", size: 180 },
    ],
    []
  );

  const openForm = (table = null) => {
    setEditTable(table);
    setFormOpen(true);
  };

  const handleSave = async (values) => {
    try {
      const payload = {
        name: values.name.trim(),
        description: values.description.trim(),
      };
      if (editTable) {
        if (!editTable.uuid) {
          throw new Error("Cannot update this table: its UUID is missing.");
        }
        await dispatch(updateTable({
          uuid: editTable.uuid,
          data: payload,
        })).unwrap();
      } else {
        await dispatch(createTable(payload)).unwrap();
      }
      showSuccessToast(editTable ? "Table updated." : "Table created.");
      setFormOpen(false);
      setEditTable(null);
      await loadTables();
    } catch (error) {
      showErrorToast(getErrorMessage(error, "Unable to save table."));
    }
  };

  const handleDelete = async () => {
    if (!deleteData) return;
    try {
      if (deleteData.type === "batch") {
        await dispatch(batchDeleteTables(deleteData.uuids)).unwrap();
        showSuccessToast("Selected tables deleted.");
      } else {
        if (!deleteData.table.uuid) {
          throw new Error("Cannot delete this table: its UUID is missing.");
        }
        await dispatch(deleteTable(deleteData.table.uuid)).unwrap();
        showSuccessToast("Table deleted.");
      }
      setDeleteData(null);
      setRowSelection({});
      await loadTables();
    } catch (error) {
      showErrorToast(getErrorMessage(error, "Unable to delete table(s)."));
    }
  };

  const selectedCount = Object.values(rowSelection).filter(Boolean).length;

  return (
    <Box sx={{ width: "100%" }}>
      <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
        Table Management
      </Typography>
      {loadError && <Alert severity="error" sx={{ mb: 2 }}>{loadError}</Alert>}
      <Paper sx={{ width: "100%", p: 2 }}>
        <Table
          columns={columns}
          data={tables}
          isLoading={isLoading}
          onCreate={() => openForm()}
          onEdit={(row) => openForm(row.original)}
          onDelete={(row) =>
            setDeleteData({ type: "single", table: row.original })
          }
          enableRowSelection
          positionToolbarAlertBanner="none"
          getRowId={(row) => row.uuid || String(row.id)}
          onRowSelectionChange={setRowSelection}
          state={{ rowSelection }}
          renderTopToolbarCustomActions={({ table }) => (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              <Button
                variant="contained"
                disabled={isSaving}
                onClick={() => openForm()}
              >
                Create Table
              </Button>
              {selectedCount > 0 && (
                <Button
                  variant="outlined"
                  color="error"
                  disabled={isSaving}
                  onClick={() => {
                    const uuids = table
                      .getSelectedRowModel()
                      .rows.map((row) => row.original.uuid);
                    if (uuids.some((uuid) => !uuid)) {
                      showErrorToast(
                        "Cannot delete selected tables: a selected table has no UUID."
                      );
                    } else if (uuids.length) {
                      setDeleteData({ type: "batch", uuids });
                    }
                  }}
                >
                  Delete Selected ({selectedCount})
                </Button>
              )}
            </Box>
          )}
        />
      </Paper>
      <TableForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSave}
        editData={editTable}
        isLoading={isSaving}
      />
      <DeleteConfirmationModal
        isOpen={Boolean(deleteData)}
        onClose={() => !isSaving && setDeleteData(null)}
        onDelete={handleDelete}
        isLoading={isSaving}
        title={
          deleteData?.type === "batch"
            ? "Delete selected tables?"
            : "Delete table?"
        }
        message={
          deleteData?.type === "batch"
            ? `You are about to delete ${deleteData.uuids.length} table(s). This action cannot be undone.`
            : `Are you sure you want to delete "${deleteData?.table?.name || ""}"? This action cannot be undone.`
        }
      />
    </Box>
  );
}
