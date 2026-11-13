import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Alert, Box, Button, Paper, Typography } from "@mui/material";
import Table from "../../../../components/tables/Table";
import DeleteConfirmationModal from "../../../../components/common/DeleteConfirmationModal";
import {
  showErrorToast,
  showSuccessToast,
} from "../../../../components/common/ToastMessage";
import CategoryForm from "../components/CategoryForm";
import {
  createCategory,
  deleteCategory,
  fetchCategories,
  updateCategory,
} from "../store/categoriesSlice";

const getErrorMessage = (error, fallback) => {
  if (typeof error === "string") return error;
  const message = error.response?.data?.message ?? error.message;
  if (typeof message === "string") return message;
  if (message && typeof message === "object") {
    return Object.entries(message)
      .flatMap(([field, errors]) =>
        (Array.isArray(errors) ? errors : [errors]).map((item) => `${field}: ${item}`)
      )
      .join("\n");
  }
  return fallback;
};

export default function CategoriesPage() {
  const dispatch = useDispatch();
  const { items: categories, isLoading, isSaving, isImporting } = useSelector(
    (state) => state.categories
  );
  const [formOpen, setFormOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteData, setDeleteData] = useState(null);
  const [loadError, setLoadError] = useState("");
  const importRef = useRef(null);

  const loadCatgories = useCallback(async () => {
    try {
      await dispatch(fetchCategories()).unwrap();
      setLoadError("");
    } catch (error) {
      const message = getErrorMessage(error, "Unable to load categories.");
      setLoadError(message);
      showErrorToast(message);
    }
  }, [dispatch]);

  useEffect(() => { loadCatgories(); }, [loadCatgories]);

  const columns = useMemo(() => [
    { accessorKey: "name", header: "Name", size: 240 },
    { accessorKey: "code", header: "Code", size: 240 },
    { accessorKey: "description", header: "Description", size: 300 },
    { accessorKey: "created_by", header: "Created By", size: 160 },
    { accessorKey: "created_at", header: "Created Date", size: 180 },
  ], []);

  const handleSave = async (values) => {
    try {
      if (editData) {
        await dispatch(updateCategory({
          uuid: editData.uuid || editData.id,
          data: values,
        })).unwrap();
      } else {
        await dispatch(createCategory(values)).unwrap();
      }
      showSuccessToast(`Category ${editData ? "updated" : "created"}.`);
      setFormOpen(false);
      setEditData(null);
      await loadCatgories();
    } catch (error) {
      showErrorToast(getErrorMessage(error, "Unable to save category state."));
    }
  };

  const handleDelete = async () => {
    if (!deleteData) return;
    try {
      await dispatch(
        deleteCategory(deleteData.uuid || deleteData.id)
      ).unwrap();
      showSuccessToast("Category deleted.");
      setDeleteData(null);
      await loadCatgories();
    } catch (error) {
      showErrorToast(getErrorMessage(error, "Unable to delete category."));
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Typography component="h1" variant="h5" sx={{ mb: 2 }}>Category Management</Typography>
      {loadError && <Alert severity="error" sx={{ mb: 2 }}>{loadError}</Alert>}
      <Paper sx={{ width: "100%", p: 2 }}>
        <Table
          columns={columns}
          data={categories}
          isLoading={isLoading}
          onCreate={() => { setEditData(null); setFormOpen(true); }}
          onEdit={(row) => { setEditData(row.original); setFormOpen(true); }}
          onDelete={(row) => setDeleteData(row.original)}
          createButtonLabel="Create Category"
          getRowId={(row) => row.uuid || String(row.id)}
          renderTopToolbarCustomActions={() => (
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button variant="contained" disabled={isSaving || isImporting} onClick={() => { setEditData(null); setFormOpen(true); }}>
                Create Category
              </Button>
            </Box>
          )}
        />
      </Paper>
      <CategoryForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSave}
        editData={editData}
        isLoading={isSaving}
      />
      <DeleteConfirmationModal
        isOpen={Boolean(deleteData)}
        onClose={() => !isSaving && setDeleteData(null)}
        onDelete={handleDelete}
        isLoading={isSaving}
        title="Delete category?"
        message={`Are you sure you want to delete "${deleteData?.name || ""}"? This action cannot be undone.`}
      />
    </Box>
  );
}
