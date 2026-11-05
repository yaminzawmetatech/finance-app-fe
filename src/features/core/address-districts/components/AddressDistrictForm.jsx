import { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  MenuItem,
  Switch,
  TextField,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import addressStatesService from "../../address-states/services/addressStatesService";
import { showErrorToast } from "../../../../components/common/ToastMessage";

const getItems = (response) => {
  const payload = response?.data ?? response;
  return Array.isArray(payload) ? payload : Array.isArray(payload?.data) ? payload.data : [];
};

const EMPTY_DISTRICT = {
  name: "",
  district_code: "",
  district_mya_mm3: "",
  address_state_id: "",
  description: "",
  is_blacklisted: false,
};

export default function AddressDistrictForm({
  open,
  onClose,
  onSubmit,
  editData,
  isLoading,
}) {
  const [states, setStates] = useState([]);
  const { control, register, handleSubmit, reset } = useForm({
    defaultValues: EMPTY_DISTRICT,
  });

  useEffect(() => {
    let active = true;
    addressStatesService
      .getAll()
      .then((response) => {
        if (active) setStates(getItems(response));
      })
      .catch((error) =>
        showErrorToast(error.message || "Unable to load address states.")
      );
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    reset(
      editData
        ? {
            ...EMPTY_DISTRICT,
            ...editData,
            address_state_id: editData.address_state_id ?? "",
            description:
              editData.description === "---" ? "" : editData.description || "",
          }
        : EMPTY_DISTRICT
    );
  }, [open, editData, reset]);

  return (
    <Dialog open={open} onClose={() => !isLoading && onClose()} fullWidth maxWidth="sm">
      <DialogTitle>
        {editData ? "Edit Address District" : "Create Address District"}
      </DialogTitle>
      <form
        onSubmit={handleSubmit((values) =>
          onSubmit({
            ...values,
            address_state_id: Number(values.address_state_id),
          })
        )}
      >
        <DialogContent sx={{ display: "grid", gap: 2, pt: 1 }}>
          <Controller
            name="address_state_id"
            control={control}
            rules={{ required: "State is required." }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                select
                label="State / Region"
                value={field.value ?? ""}
                error={Boolean(fieldState.error)}
                helperText={fieldState.error?.message}
              >
                {states.map((state) => (
                  <MenuItem key={state.id} value={String(state.id)}>
                    {state.name}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
          <TextField
            label="District Name"
            {...register("name", { required: "District name is required." })}
          />
          <TextField label="District Code" {...register("district_code")} />
          <TextField label="District (Myanmar)" {...register("district_mya_mm3")} />
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
