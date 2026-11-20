import { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import mainBusinessCategoriesService from "../../main-business-categories/services/mainBusinessCategoriesService";
import { showErrorToast } from "../../../../components/common/ToastMessage";

const EMPTY_CATEGORY = {
  bc2_code: "",
  bc2_name: "",
  bc2_name_mm: "",
  main_business_category_id: "",
  description: "",
};

const getItems = (response) => {
  const payload = response?.data ?? response;
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
};

export default function SubBusinessCategoryForm({
  open,
  onClose,
  onSubmit,
  editData,
  isLoading,
}) {
  const [mainBusinessCategories, setMainBusinessCategories] = useState([]);
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: EMPTY_CATEGORY });

  useEffect(() => {
    let active = true;
    mainBusinessCategoriesService
      .getAll()
      .then((response) => {
        if (active) setMainBusinessCategories(getItems(response));
      })
      .catch((error) => {
        if (active) {
          showErrorToast(
            error.message || "Unable to load main business categories."
          );
        }
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    reset(
      editData
        ? {
            ...EMPTY_CATEGORY,
            ...editData,
            main_business_category_id:
              editData.main_business_category_id ?? "",
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
        {editData ? "Edit Sub Business Category" : "Create Sub Business Category"}
      </DialogTitle>
      <form
        onSubmit={handleSubmit((values) =>
          onSubmit({
            ...values,
            main_business_category_id: Number(
              values.main_business_category_id
            ),
          })
        )}
      >
        <DialogContent sx={{ display: "grid", gap: 2, pt: 1 }}>
          <Controller
            name="main_business_category_id"
            control={control}
            rules={{ required: "Main business category is required." }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                select
                label="Main Business Category"
                value={field.value ?? ""}
                error={Boolean(fieldState.error)}
                helperText={fieldState.error?.message}
              >
                {mainBusinessCategories.map((category) => (
                  <MenuItem key={category.id} value={String(category.id)}>
                    {category.bc1_code
                      ? `${category.bc1_code} - ${category.bc1_name}`
                      : category.bc1_name}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
          <TextField
            label="Sub Business Category Code"
            {...register("bc2_code", {
              required: "Sub business category code is required.",
            })}
            error={Boolean(errors.bc2_code)}
            helperText={errors.bc2_code?.message}
          />
          <TextField
            label="Sub Business Category Name"
            {...register("bc2_name", {
              required: "Sub business category name is required.",
            })}
            error={Boolean(errors.bc2_name)}
            helperText={errors.bc2_name?.message}
          />
          <TextField
            label="Sub Business Category Name (Myanmar)"
            {...register("bc2_name_mm")}
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
