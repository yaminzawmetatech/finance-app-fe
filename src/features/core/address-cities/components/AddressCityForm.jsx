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
import addressTownshipsService from "../../address-townships/services/addressTownshipsService";
import { showErrorToast } from "../../../../components/common/ToastMessage";

const getItems = (response) => {
  const payload = response?.data ?? response;
  return Array.isArray(payload) ? payload : Array.isArray(payload?.data) ? payload.data : [];
};

const EMPTY_CITY = {
  name: "",
  town_pcode: "",
  city_mya_mm3: "",
  address_township_id: "",
  description: "",
  is_blacklisted: false,
};

export default function AddressCityForm({
  open,
  onClose,
  onSubmit,
  editData,
  isLoading,
}) {
  const [townships, setTownships] = useState([]);
  const { control, register, handleSubmit, reset } = useForm({
    defaultValues: EMPTY_CITY,
  });

  useEffect(() => {
    let active = true;
    addressTownshipsService
      .getAll()
      .then((response) => {
        if (active) setTownships(getItems(response));
      })
      .catch((error) =>
        showErrorToast(error.message || "Unable to load address townships.")
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
            ...EMPTY_CITY,
            ...editData,
            address_township_id: editData.address_township_id ?? "",
            description:
              editData.description === "---" ? "" : editData.description || "",
          }
        : EMPTY_CITY
    );
  }, [open, editData, reset]);

  return (
    <Dialog open={open} onClose={() => !isLoading && onClose()} fullWidth maxWidth="sm">
      <DialogTitle>
        {editData ? "Edit Address City" : "Create Address City"}
      </DialogTitle>
      <form
        onSubmit={handleSubmit((values) => {
          const township = townships.find(
            (item) => String(item.id) === String(values.address_township_id)
          );
          return onSubmit({
            ...values,
            ts_pcode: township?.ts_pcode || "",
            address_township_id: Number(values.address_township_id),
          });
        })}
      >
        <DialogContent sx={{ display: "grid", gap: 2, pt: 1 }}>
          <Controller
            name="address_township_id"
            control={control}
            rules={{ required: "Township is required." }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                select
                label="Township"
                value={field.value ?? ""}
                error={Boolean(fieldState.error)}
                helperText={fieldState.error?.message}
              >
                {townships.map((township) => (
                  <MenuItem key={township.id} value={String(township.id)}>
                    {township.name} ({township.ts_pcode})
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
          <TextField
            label="City / Town Name"
            {...register("name", { required: "City / town name is required." })}
          />
          <TextField label="Town P-Code" {...register("town_pcode")} />
          <TextField label="City / Town (Myanmar)" {...register("city_mya_mm3")} />
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
