import { useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
} from "@mui/material";
import { useForm } from "react-hook-form";

const EMPTY_TOWNSHIP = {
  name: "",
  township_nrc_code: "",
  n_r_c_state_id: "",
  description: "",
};

export default function NrcTownshipForm({
  open,
  onClose,
  onSubmit,
  editData,
  isLoading,
  states = [],
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: EMPTY_TOWNSHIP });

  useEffect(() => {
    if (!open) return;
    reset(
      editData
        ? {
            ...EMPTY_TOWNSHIP,
            ...editData,
            n_r_c_state_id:
              editData.n_r_c_state_id ?? editData.nrc_state?.id ?? "",
            description:
              editData.description === "---" ? "" : editData.description || "",
          }
        : EMPTY_TOWNSHIP
    );
  }, [open, editData, reset]);

  return (
    <Dialog open={open} onClose={() => !isLoading && onClose()} fullWidth maxWidth="sm">
      <DialogTitle>
        {editData ? "Edit NRC Township" : "Create NRC Township"}
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent sx={{ display: "grid", gap: 2, pt: 1 }}>
          <TextField
            select
            label="State"
            {...register("n_r_c_state_id", {
              required: "State is required.",
              setValueAs: (value) => (value === "" ? "" : Number(value)),
            })}
            error={Boolean(errors.n_r_c_state_id)}
            helperText={errors.n_r_c_state_id?.message}
          >
            {states.map((state) => (
              <MenuItem key={state.id} value={state.id}>
                {state.name} ({state.state_code})
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Township Name"
            {...register("name", { required: "Township name is required." })}
            error={Boolean(errors.name)}
            helperText={errors.name?.message}
          />
          <TextField
            label="Township NRC Code"
            {...register("township_nrc_code", {
              required: "Township NRC code is required.",
            })}
            error={Boolean(errors.township_nrc_code)}
            helperText={errors.township_nrc_code?.message}
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
