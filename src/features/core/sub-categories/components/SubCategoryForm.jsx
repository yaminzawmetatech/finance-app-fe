import { useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Switch,
  TextField,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";

const EMPTY_STATE = {
  name: "",
  code: "",
  category_id: "",
  interest_rate: "",
  description: ""
};

export default function SubCatgoryForm({
  open,
  onClose,
  onSubmit,
  editData,
  isLoading,
  categories,
  isCategoriesLoading
}) {
  const { control, register, handleSubmit, reset } = useForm({
    defaultValues: EMPTY_STATE,
  });

  useEffect(() => {
    if (!open) return;
    reset(
      editData
        ? {
            ...EMPTY_STATE,
            ...editData,
            description:
              editData.description === "---" ? "" : editData.description || "",
          }
        : EMPTY_STATE
    );
  }, [open, editData, reset]);

  return (
    <Dialog open={open} onClose={() => !isLoading && onClose()} fullWidth maxWidth="sm">
      <DialogTitle>
        {editData ? "Edit Sub Category" : "Create Sub Category"}
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent sx={{ display: "grid", gap: 2, pt: 1 }}>
          <TextField
            label="Name"
            {...register("name", { required: "Name is required." })}
          />
          <TextField label="Code" {...register("code")} />
           <Controller
            name="category_id"
            control={control}
            rules={{ required: "Category is required." }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                select
                label="Category"
                value={field.value ?? ""}
                onChange={(event) => {
                  field.onChange(event);
                  setValue("category_id", "");
                }}
                error={Boolean(fieldState.error)}
                helperText={fieldState.error?.message}
                disabled={isCategoriesLoading}
              >
                {categories.map((state) => (
                  <MenuItem key={state.id} value={String(state.id)}>
                    {state.name}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
          <TextField
            label="Description"
            multiline
            minRows={2}
            {...register("description")}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={onClose} disabled={isLoading}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={isLoading}>
            {isLoading ? "Saving..." : editData ? "Save Changes" : "Create"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
