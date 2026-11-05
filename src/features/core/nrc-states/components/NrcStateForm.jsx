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

const EMPTY_STATE = { name: "", state_code: "", description: "" };

export default function NrcStateForm({
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
            name: editData.name || "",
            state_code: editData.state_code ?? "",
            description:
              editData.description === "---" ? "" : editData.description || "",
          }
        : EMPTY_STATE
    );
  }, [open, editData, reset]);

  return (
    <Dialog open={open} onClose={() => !isLoading && onClose()} fullWidth maxWidth="sm">
      <DialogTitle>
        {editData ? "Edit NRC State" : "Create NRC State"}
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent sx={{ display: "grid", gap: 2, pt: 1 }}>
          <TextField
            label="State Name"
            {...register("name", { required: "State name is required." })}
            error={Boolean(errors.name)}
            helperText={errors.name?.message}
          />
          <TextField
            label="State Code"
            type="number"
            {...register("state_code", {
              required: "State code is required.",
              setValueAs: (value) => (value === "" ? "" : Number(value)),
            })}
            error={Boolean(errors.state_code)}
            helperText={errors.state_code?.message}
          />
          <TextField label="Description" {...register("description")} />
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
