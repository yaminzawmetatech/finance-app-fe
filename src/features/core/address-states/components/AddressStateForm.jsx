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
  state_mya_mm3: "",
  sr_pcode: "",
  description: "",
  is_blacklisted: false,
};

export default function AddressStateForm({
  open,
  onClose,
  onSubmit,
  editData,
  isLoading,
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
        {editData ? "Edit Address State" : "Create Address State"}
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent sx={{ display: "grid", gap: 2, pt: 1 }}>
          <TextField
            label="State / Region Name"
            {...register("name", { required: "State / region name is required." })}
          />
          <TextField label="State / Region (Myanmar)" {...register("state_mya_mm3")} />
          <TextField label="State / Region P-Code" {...register("sr_pcode")} />
          <TextField
            label="Description"
            multiline
            minRows={2}
            {...register("description")}
          />
          <FormControlLabel
            label="Blacklisted"
            control={
              <Controller
                name="is_blacklisted"
                control={control}
                render={({ field }) => (
                  <Switch
                    checked={Boolean(field.value)}
                    onChange={(event) => field.onChange(event.target.checked)}
                  />
                )}
              />
            }
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
