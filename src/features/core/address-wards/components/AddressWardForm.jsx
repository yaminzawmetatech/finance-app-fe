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
import addressCitiesService from "../../address-cities/services/addressCitiesService";
import { showErrorToast } from "../../../../components/common/ToastMessage";

const getItems = (response) => {
  const payload = response?.data ?? response;
  return Array.isArray(payload) ? payload : Array.isArray(payload?.data) ? payload.data : [];
};

const EMPTY_WARD = {
  name: "",
  ward_pcode: "",
  ward_mya_mm3: "",
  address_city_id: "",
  description: "",
  is_blacklisted: false,
};

export default function AddressWardForm({
  open,
  onClose,
  onSubmit,
  editData,
  isLoading,
}) {
  const [cities, setCities] = useState([]);
  const { control, register, handleSubmit, reset } = useForm({
    defaultValues: EMPTY_WARD,
  });

  useEffect(() => {
    let active = true;
    addressCitiesService
      .getAll()
      .then((response) => {
        if (active) setCities(getItems(response));
      })
      .catch((error) =>
        showErrorToast(error.message || "Unable to load address cities.")
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
            ...EMPTY_WARD,
            ...editData,
            address_city_id: editData.address_city_id ?? "",
            description:
              editData.description === "---" ? "" : editData.description || "",
          }
        : EMPTY_WARD
    );
  }, [open, editData, reset]);

  return (
    <Dialog open={open} onClose={() => !isLoading && onClose()} fullWidth maxWidth="sm">
      <DialogTitle>
        {editData ? "Edit Address Ward" : "Create Address Ward"}
      </DialogTitle>
      <form
        onSubmit={handleSubmit((values) =>
          onSubmit({ ...values, address_city_id: Number(values.address_city_id) })
        )}
      >
        <DialogContent sx={{ display: "grid", gap: 2, pt: 1 }}>
          <Controller
            name="address_city_id"
            control={control}
            rules={{ required: "City / town is required." }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                select
                label="City / Town"
                value={field.value ?? ""}
                error={Boolean(fieldState.error)}
                helperText={fieldState.error?.message}
              >
                {cities.map((city) => (
                  <MenuItem key={city.id} value={String(city.id)}>
                    {city.name} ({city.town_pcode})
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
          <TextField
            label="Ward Name"
            {...register("name", { required: "Ward name is required." })}
          />
          <TextField
            label="Ward P-Code"
            {...register("ward_pcode", { required: "Ward P-Code is required." })}
          />
          <TextField label="Ward (Myanmar)" {...register("ward_mya_mm3")} />
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
