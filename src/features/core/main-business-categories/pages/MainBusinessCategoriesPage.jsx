import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Alert, Box, Button, Paper, Typography } from "@mui/material";
import Table from "../../../../components/tables/Table";
import DeleteConfirmationModal from "../../../../components/common/DeleteConfirmationModal";
import {
  showErrorToast,
  showSuccessToast,
} from "../../../../components/common/ToastMessage";
import MainBusinessCategoryForm from "../components/MainBusinessCategoryForm";
import {
  batchDeleteMainBusinessCategories,
  createMainBusinessCategory,
  deleteMainBusinessCategory,
  fetchMainBusinessCategories,
  importMainBusinessCategories,
  updateMainBusinessCategory,
} from "../store/mainBusinessCategoriesSlice";

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

export default function MainBusinessCategoriesPage() {
  const dispatch = useDispatch();
  const {
    items: categories,
    isLoading,
    isSaving,
    isImporting,
  } = useSelector((state) => state.mainBusinessCategories);
  const [formOpen, setFormOpen] = useState(false);
  const [editCategory, setEditCategory] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  const [rowSelection, setRowSelection] = useState({});
  const [loadError, setLoadError] = useState("");
  const importInputRef = useRef(null);

  const loadCategories = useCallback(async () => {
    try {
      await dispatch(fetchMainBusinessCategories()).unwrap();
      setLoadError("");
    } catch (error) {
      const message = getErrorMessage(
        error,
        "Unable to load main business categories."
      );
      setLoadError(message);
      showErrorToast(message);
    }
  }, [dispatch]);

  useEffect(() => {
    let active = true;
    dispatch(fetchMainBusinessCategories())
      .unwrap()
      .then(() => {
        if (active) setLoadError("");
      })
      .catch((error) => {
        if (!active) return;
        const message = getErrorMessage(
          error,
          "Unable to load main business categories."
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
      { accessorKey: "bc1_code", header: "Category Code", size: 170 },
      { accessorKey: "bc1_name", header: "Category Name", size: 240 },
      { accessorKey: "bc1_name_mm", header: "Category Name (Myanmar)", size: 240 },
      { accessorKey: "description", header: "Description", size: 300 },
      { accessorKey: "created_by", header: "Created By", size: 160 },
      { accessorKey: "created_at", header: "Created Date", size: 180 },
    ],
    []
  );

  const openForm = (category = null) => {
    setEditCategory(category);
    setFormOpen(true);
  };

  const handleSave = async (values) => {
    const data = {
      bc1_code: values.bc1_code.trim(),
      bc1_name: values.bc1_name.trim(),
      bc1_name_mm: values.bc1_name_mm.trim(),
      description: values.description.trim(),
    };

    try {
      if (editCategory) {
        await dispatch(
          updateMainBusinessCategory({
            uuid: editCategory.uuid || editCategory.id,
            data,
          })
        ).unwrap();
      } else {
        await dispatch(createMainBusinessCategory(data)).unwrap();
      }

      showSuccessToast(
        `Main business category ${editCategory ? "updated" : "created"}.`
      );
      setFormOpen(false);
      setEditCategory(null);
      await loadCategories();
    } catch (error) {
      showErrorToast(
        getErrorMessage(error, "Unable to save main business category.")
      );
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirmation) return;

    try {
      if (deleteConfirmation.type === "batch") {
        await dispatch(
          batchDeleteMainBusinessCategories(deleteConfirmation.uuids)
        ).unwrap();
        showSuccessToast("Selected main business categories deactivated.");
      } else {
        await dispatch(
          deleteMainBusinessCategory(
            deleteConfirmation.category.uuid ||
              deleteConfirmation.category.id
          )
        ).unwrap();
        showSuccessToast("Main business category deactivated.");
      }
      setDeleteConfirmation(null);
      setRowSelection({});
      await loadCategories();
    } catch (error) {
      showErrorToast(
        getErrorMessage(
          error,
          "Unable to deactivate main business category(s)."
        )
      );
    }
  };

  const handleImport = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    try {
      const response = await dispatch(
        importMainBusinessCategories(file)
      ).unwrap();
      const payload = response?.data ?? response;
      setRowSelection({});
      showSuccessToast(
        Number.isFinite(payload?.rowCount)
          ? `Imported ${payload.rowCount} main business category(s).`
          : "Main business categories imported."
      );
      await loadCategories();
    } catch (error) {
      showErrorToast(
        getErrorMessage(error, "Unable to import main business categories.")
      );
    }
  };

  const selectedCount = Object.keys(rowSelection).length;
  const isBusy = isSaving || isImporting;

  return (
    <Box sx={{ width: "100%" }}>
      <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
        Main Business Categories
      </Typography>
      {loadError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {loadError}
        </Alert>
      )}
      <Paper sx={{ width: "100%", p: 2 }}>
        <Table
          columns={columns}
          data={categories}
          isLoading={isLoading}
          onCreate={() => openForm()}
          onEdit={(row) => openForm(row.original)}
          onDelete={(row) =>
            setDeleteConfirmation({
              type: "single",
              category: row.original,
            })
          }
          createButtonLabel="Create Main Business Category"
          enableRowSelection
          positionToolbarAlertBanner="none"
          getRowId={(row) => row.uuid || String(row.id)}
          onRowSelectionChange={setRowSelection}
          state={{ rowSelection }}
          renderTopToolbarCustomActions={() => (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              <Button
                variant="contained"
                onClick={() => openForm()}
                disabled={isBusy}
              >
                Create Main Business Category
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
                    const selectedIds = Object.keys(rowSelection);
                    const selectedRows = categories.filter((category) =>
                      selectedIds.includes(category.uuid || String(category.id))
                    );
                    const uuids = selectedRows.map(
                      (category) => category.uuid
                    );
                    if (uuids.some((uuid) => !uuid)) {
                      showErrorToast(
                        "Cannot deactivate selected categories: a selected category has no UUID."
                      );
                    } else if (uuids.length) {
                      setDeleteConfirmation({ type: "batch", uuids });
                    }
                  }}
                >
                  Deactivate Selected ({selectedCount})
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

      <MainBusinessCategoryForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSave}
        editData={editCategory}
        isLoading={isSaving}
      />

      <DeleteConfirmationModal
        isOpen={Boolean(deleteConfirmation)}
        onClose={() => !isBusy && setDeleteConfirmation(null)}
        onDelete={handleDelete}
        isLoading={isBusy}
        title={
          deleteConfirmation?.type === "batch"
            ? "Deactivate selected main business categories?"
            : "Deactivate main business category?"
        }
        message={
          deleteConfirmation?.type === "batch"
            ? `You are about to deactivate ${deleteConfirmation.uuids.length} main business category(s).`
            : `Are you sure you want to deactivate "${deleteConfirmation?.category?.bc1_name || ""}"?`
        }
      />
    </Box>
  );
}
