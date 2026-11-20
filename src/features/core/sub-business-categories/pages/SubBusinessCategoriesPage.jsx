import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Alert, Box, Button, Paper, Typography } from "@mui/material";
import Table from "../../../../components/tables/Table";
import DeleteConfirmationModal from "../../../../components/common/DeleteConfirmationModal";
import {
  showErrorToast,
  showSuccessToast,
} from "../../../../components/common/ToastMessage";
import SubBusinessCategoryForm from "../components/SubBusinessCategoryForm";
import {
  createSubBusinessCategory,
  deleteSubBusinessCategory,
  fetchSubBusinessCategories,
  importSubBusinessCategories,
  updateSubBusinessCategory,
} from "../store/subBusinessCategoriesSlice";

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

export default function SubBusinessCategoriesPage() {
  const dispatch = useDispatch();
  const {
    items: categories,
    isLoading,
    isSaving,
    isImporting,
  } = useSelector((state) => state.subBusinessCategories);
  const [formOpen, setFormOpen] = useState(false);
  const [editCategory, setEditCategory] = useState(null);
  const [deleteCategory, setDeleteCategory] = useState(null);
  const [loadError, setLoadError] = useState("");
  const importInputRef = useRef(null);

  const loadCategories = useCallback(async () => {
    try {
      await dispatch(fetchSubBusinessCategories()).unwrap();
      setLoadError("");
    } catch (error) {
      const message = getErrorMessage(
        error,
        "Unable to load sub business categories."
      );
      setLoadError(message);
      showErrorToast(message);
    }
  }, [dispatch]);

  useEffect(() => {
    let active = true;
    dispatch(fetchSubBusinessCategories())
      .unwrap()
      .then(() => {
        if (active) setLoadError("");
      })
      .catch((error) => {
        if (!active) return;
        const message = getErrorMessage(
          error,
          "Unable to load sub business categories."
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
      { accessorKey: "bc2_code", header: "Sub Category Code", size: 180 },
      { accessorKey: "bc2_name", header: "Sub Category Name", size: 230 },
      {
        accessorKey: "bc2_name_mm",
        header: "Sub Category Name (Myanmar)",
        size: 240,
      },
      {
        accessorKey: "main_business_category_code",
        header: "Main Category Code",
        size: 180,
      },
      {
        accessorKey: "main_business_category_name",
        header: "Main Category Name",
        size: 220,
      },
      { accessorKey: "description", header: "Description", size: 280 },
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
      ...values,
      bc2_code: values.bc2_code.trim(),
      bc2_name: values.bc2_name.trim(),
      bc2_name_mm: values.bc2_name_mm.trim(),
      description: values.description.trim(),
    };

    try {
      if (editCategory) {
        await dispatch(
          updateSubBusinessCategory({
            uuid: editCategory.uuid || editCategory.id,
            data,
          })
        ).unwrap();
      } else {
        await dispatch(createSubBusinessCategory(data)).unwrap();
      }

      showSuccessToast(
        `Sub business category ${editCategory ? "updated" : "created"}.`
      );
      setFormOpen(false);
      setEditCategory(null);
      await loadCategories();
    } catch (error) {
      showErrorToast(
        getErrorMessage(error, "Unable to save sub business category.")
      );
    }
  };

  const handleDelete = async () => {
    if (!deleteCategory) return;
    try {
      await dispatch(
        deleteSubBusinessCategory(deleteCategory.uuid || deleteCategory.id)
      ).unwrap();
      showSuccessToast("Sub business category deactivated.");
      setDeleteCategory(null);
      await loadCategories();
    } catch (error) {
      showErrorToast(
        getErrorMessage(error, "Unable to deactivate sub business category.")
      );
    }
  };

  const handleImport = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    try {
      const response = await dispatch(
        importSubBusinessCategories(file)
      ).unwrap();
      const payload = response?.data ?? response;
      showSuccessToast(
        Number.isFinite(payload?.rowCount)
          ? `Imported ${payload.rowCount} sub business category(s).`
          : "Sub business categories imported."
      );
      await loadCategories();
    } catch (error) {
      showErrorToast(
        getErrorMessage(error, "Unable to import sub business categories.")
      );
    }
  };

  const isBusy = isSaving || isImporting;

  return (
    <Box sx={{ width: "100%" }}>
      <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
        Sub Business Categories
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
          onDelete={(row) => setDeleteCategory(row.original)}
          createButtonLabel="Create Sub Business Category"
          getRowId={(row) => row.uuid || String(row.id)}
          renderTopToolbarCustomActions={() => (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              <Button
                variant="contained"
                onClick={() => openForm()}
                disabled={isBusy}
              >
                Create Sub Business Category
              </Button>
              <Button
                variant="outlined"
                onClick={() => importInputRef.current?.click()}
                disabled={isBusy}
              >
                {isImporting ? "Importing..." : "Import Excel"}
              </Button>
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
      <SubBusinessCategoryForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSave}
        editData={editCategory}
        isLoading={isSaving}
      />
      <DeleteConfirmationModal
        isOpen={Boolean(deleteCategory)}
        onClose={() => !isBusy && setDeleteCategory(null)}
        onDelete={handleDelete}
        isLoading={isBusy}
        title="Deactivate sub business category?"
        message={`Are you sure you want to deactivate "${deleteCategory?.bc2_name || ""}"?`}
      />
    </Box>
  );
}
