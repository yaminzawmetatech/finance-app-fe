import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Alert, Box, Button, Paper, Typography } from "@mui/material";
import Table from "../../../../components/tables/Table";
import DeleteConfirmationModal from "../../../../components/common/DeleteConfirmationModal";
import {
  showErrorToast,
  showSuccessToast,
} from "../../../../components/common/ToastMessage";
import {
  createSubCatgory,
  deleteSubCatgory,
  fetchSubCatgories,
  updateSubCatgory,
} from "../store/subCategoriesSlice";
import { fetchCategories } from "../../categories/store/categoriesSlice";
import SubCatgoryForm from "../components/SubCategoryForm";

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
  const { items: subCategories, isLoading, isSaving, isImporting } = useSelector(
    (state) => state.subCategories
  );
  const [formOpen, setFormOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteData, setDeleteData] = useState(null);
  const [loadError, setLoadError] = useState("");
  const importRef = useRef(null);

  const { items: categories, isLoading: isCategoriesLoading,
  } = useSelector((state) => state.categories);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const loadSubCatgories = useCallback(async () => {
    try {
      await dispatch(fetchSubCatgories()).unwrap();
      setLoadError("");
    } catch (error) {
      const message = getErrorMessage(error, "Unable to load categories.");
      setLoadError(message);
      showErrorToast(message);
    }
  }, [dispatch]);

  useEffect(() => { loadSubCatgories(); }, [loadSubCatgories]);

  const columns = useMemo(() => [
    { accessorKey: "name", header: "Name", size: 240 },
    { accessorKey: "code", header: "Code", size: 240 },
    { accessorKey: "cateogry", header: "Category", size: 240 },
    { accessorKey: "description", header: "Description", size: 300 },
    { accessorKey: "created_by", header: "Created By", size: 160 },
    { accessorKey: "created_at", header: "Created Date", size: 180 },
  ], []);

  const handleSave = async (values) => {
    try {
      if (editData) {
        await dispatch(updateSubCatgory({
          uuid: editData.uuid || editData.id,
          data: values,
        })).unwrap();
      } else {
        await dispatch(createSubCatgory(values)).unwrap();
      }
      showSuccessToast(`Sub Category ${editData ? "updated" : "created"}.`);
      setFormOpen(false);
      setEditData(null);
      await loadSubCatgories();
    } catch (error) {
      showErrorToast(getErrorMessage(error, "Unable to save sub category."));
    }
  };

  const handleDelete = async () => {
    if (!deleteData) return;
    try {
      await dispatch(
        deleteSubCatgory(deleteData.uuid || deleteData.id)
      ).unwrap();
      showSuccessToast("Category deleted.");
      setDeleteData(null);
      await loadSubCatgories();
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
          data={subCategories}
          isLoading={isLoading}
          onCreate={() => { setEditData(null); setFormOpen(true); }}
          onEdit={(row) => { setEditData(row.original); setFormOpen(true); }}
          onDelete={(row) => setDeleteData(row.original)}
          createButtonLabel="Create Category"
          getRowId={(row) => row.uuid || String(row.id)}
          renderTopToolbarCustomActions={() => (
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button variant="contained" disabled={isSaving || isImporting} onClick={() => { setEditData(null); setFormOpen(true); }}>
                Create Sub Category
              </Button>
            </Box>
          )}
        />
      </Paper>
      <SubCatgoryForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSave}
        editData={editData}
        isLoading={isSaving}
        categories={categories}
        isCategoriesLoading={isCategoriesLoading}
      />
      <DeleteConfirmationModal
        isOpen={Boolean(deleteData)}
        onClose={() => !isSaving && setDeleteData(null)}
        onDelete={handleDelete}
        isLoading={isSaving}
        title="Delete sub category?"
        message={`Are you sure you want to delete "${deleteData?.name || ""}"? This action cannot be undone.`}
      />
    </Box>
  );
}
