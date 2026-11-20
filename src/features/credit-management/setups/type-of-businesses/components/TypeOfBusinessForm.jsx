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

const EMPTY_STATE = {
  name: "",
  code: "",
  description: "",
};

export default function TypeOfBusinessForm({
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
  } = useForm({ defaultValues: EMPTY_STATE });

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
    <Dialog
      open={open}
      onClose={() => !isLoading && onClose()}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>
        {editData ? "Edit Type of Business" : "Create Type of Business"}
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent sx={{ display: "grid", gap: 2, pt: 1 }}>
          <TextField
            label="Name"
            {...register("name", { required: "Name is required." })}
            error={Boolean(errors.name)}
            helperText={errors.name?.message}
            autoFocus
          />
          <TextField label="Code" {...register("code")} />
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
