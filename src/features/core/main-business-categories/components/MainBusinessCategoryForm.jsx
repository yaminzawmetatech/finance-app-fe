import { useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useForm } from "react-hook-form";

const EMPTY_CATEGORY = {
  bc1_code: "",
  bc1_name: "",
  bc1_name_mm: "",
  description: "",
};

export default function MainBusinessCategoryForm({
  open,
  onClose,
  onSubmit,
  editData,
  isLoading,
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: EMPTY_CATEGORY });

  useEffect(() => {
    if (!open) return;
    reset(
      editData
        ? {
            ...EMPTY_CATEGORY,
            ...editData,
            description:
              editData.description === "---" ? "" : editData.description || "",
          }
        : EMPTY_CATEGORY
    );
  }, [open, editData, reset]);

  return (
    <Dialog
      open={open}
      onClose={() => !isLoading && onClose()}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>
        {editData ? "Edit Main Business Category" : "Create Main Business Category"}
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent sx={{ display: "grid", gap: 2, pt: 1 }}>
          <TextField
            label="Business Category Code"
            {...register("bc1_code", {
              required: "Business category code is required.",
            })}
            error={Boolean(errors.bc1_code)}
            helperText={errors.bc1_code?.message}
          />
          <TextField
            label="Business Category Name"
            {...register("bc1_name", {
              required: "Business category name is required.",
            })}
            error={Boolean(errors.bc1_name)}
            helperText={errors.bc1_name?.message}
          />
          <TextField
            label="Business Category Name (Myanmar)"
            {...register("bc1_name_mm")}
          />
          <TextField
            label="Description"
            multiline
            minRows={2}
            {...register("description")}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={isLoading}>
            {isLoading
              ? "Saving..."
              : editData
                ? "Save Changes"
                : "Create"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
