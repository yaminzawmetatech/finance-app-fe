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

const EMPTY_POSITION = { name: "", description: "" };

export default function PositionForm({
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
  } = useForm({ defaultValues: EMPTY_POSITION });

  useEffect(() => {
    if (!open) return;
    reset({
      name: editData?.name || "",
      description:
        editData?.description === "---" ? "" : editData?.description || "",
    });
  }, [open, editData, reset]);

  return (
    <Dialog open={open} onClose={() => !isLoading && onClose()} fullWidth maxWidth="sm">
      <DialogTitle>
        {editData ? "Edit Position" : "Create Position"}
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent sx={{ display: "grid", gap: 2, pt: 1 }}>
          <TextField
            label="Position Name"
            fullWidth
            {...register("name", { required: "Position name is required." })}
            error={Boolean(errors.name)}
            helperText={errors.name?.message}
          />
          <TextField
            label="Description"
            fullWidth
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
            {isLoading ? "Saving..." : editData ? "Save Changes" : "Create"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
