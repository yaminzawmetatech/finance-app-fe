import { useEffect, useMemo, useState } from "react";
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
import { Controller, useForm, useWatch } from "react-hook-form";
import addressStatesService from "../../address-states/services/addressStatesService";
import addressDistrictsService from "../../address-districts/services/addressDistrictsService";
import { showErrorToast } from "../../../../components/common/ToastMessage";

const getItems = (response) => {
  const payload = response?.data ?? response;
  return Array.isArray(payload) ? payload : Array.isArray(payload?.data) ? payload.data : [];
};

const EMPTY_TOWNSHIP = {
  name: "",
  sr_pcode: "",
  ts_pcode: "",
  township_mya_mm3: "",
  address_state_id: "",
  address_district_id: "",
  description: "",
  is_blacklisted: false,
};

export default function AddressTownshipForm({
  open,
  onClose,
  onSubmit,
  editData,
  isLoading,
}) {
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const { control, register, handleSubmit, reset, setValue } = useForm({
    defaultValues: EMPTY_TOWNSHIP,
  });
  const selectedStateId = useWatch({ control, name: "address_state_id" });
  const filteredDistricts = useMemo(
    () =>
      districts.filter(
        (district) =>
          String(district.address_state_id) === String(selectedStateId)
      ),
    [districts, selectedStateId]
  );

  useEffect(() => {
    let active = true;
    Promise.all([addressStatesService.getAll(), addressDistrictsService.getAll()])
      .then(([stateResponse, districtResponse]) => {
        if (active) {
          setStates(getItems(stateResponse));
          setDistricts(getItems(districtResponse));
        }
      })
      .catch((error) =>
        showErrorToast(error.message || "Unable to load address state/districts.")
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
            ...EMPTY_TOWNSHIP,
            ...editData,
            address_state_id: editData.address_state_id ?? "",
            address_district_id: editData.address_district_id ?? "",
            description:
              editData.description === "---" ? "" : editData.description || "",
          }
        : EMPTY_TOWNSHIP
    );
  }, [open, editData, reset]);

  const submitForm = (values) => {
    const state = states.find(
      (item) => String(item.id) === String(values.address_state_id)
    );
    return onSubmit({
      ...values,
      sr_pcode: state?.sr_pcode || values.sr_pcode,
      address_state_id: Number(values.address_state_id),
      address_district_id: Number(values.address_district_id),
    });
  };

  return (
    <Dialog open={open} onClose={() => !isLoading && onClose()} fullWidth maxWidth="sm">
      <DialogTitle>
        {editData ? "Edit Address Township" : "Create Address Township"}
      </DialogTitle>
      <form onSubmit={handleSubmit(submitForm)}>
        <DialogContent sx={{ display: "grid", gap: 2, pt: 1 }}>
          <Controller
            name="address_state_id"
            control={control}
            rules={{ required: "State / region is required." }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                select
                label="State / Region"
                value={field.value ?? ""}
                onChange={(event) => {
                  field.onChange(event);
                  setValue("address_district_id", "");
                }}
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
          <Controller
            name="address_district_id"
            control={control}
            rules={{ required: "District is required." }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                select
                label="District"
                value={field.value ?? ""}
                disabled={!selectedStateId}
                error={Boolean(fieldState.error)}
                helperText={fieldState.error?.message}
              >
                {filteredDistricts.map((district) => (
                  <MenuItem key={district.id} value={String(district.id)}>
                    {district.name}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
          <TextField
            label="Township Name"
            {...register("name", { required: "Township name is required." })}
          />
          <TextField label="State P-Code" {...register("sr_pcode")} />
          <TextField
            label="Township P-Code"
            {...register("ts_pcode", { required: "Township P-Code is required." })}
          />
          <TextField label="Township (Myanmar)" {...register("township_mya_mm3")} />
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
