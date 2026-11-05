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

const EMPTY_VILLAGE_TRACT = {
  name: "",
  vt_pcode: "",
  address_township_id: "",
  village_tract_mya_mm3: "",
  description: "",
  is_blacklisted: false,
};

export default function AddressVillageTractForm({
  open,
  onClose,
  onSubmit,
  editData,
  isLoading,
}) {
  const [townships, setTownships] = useState([]);
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: EMPTY_VILLAGE_TRACT });

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
            ...EMPTY_VILLAGE_TRACT,
            ...editData,
            address_township_id: editData.address_township_id ?? "",
            description:
              editData.description === "---" ? "" : editData.description || "",
          }
        : EMPTY_VILLAGE_TRACT
    );
  }, [open, editData, reset]);

  const submitForm = (values) =>
    onSubmit({
      ...values,
      address_township_id: Number(values.address_township_id),
    });

  return (
    <Dialog
      open={open}
      onClose={() => !isLoading && onClose()}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>
        {editData
          ? "Edit Address Village Tract"
          : "Create Address Village Tract"}
      </DialogTitle>
      <form onSubmit={handleSubmit(submitForm)}>
        <DialogContent sx={{ display: "grid", gap: 2, pt: 1 }}>
          <Controller
            name="address_township_id"
            control={control}
            rules={{ required: "Township is required." }}
            render={({ field }) => (
              <TextField
                {...field}
                select
                label="Township"
                value={field.value ?? ""}
                error={Boolean(errors.address_township_id)}
                helperText={errors.address_township_id?.message}
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
            label="Village Tract Name"
            {...register("name", {
              required: "Village tract name is required.",
            })}
            error={Boolean(errors.name)}
            helperText={errors.name?.message}
          />
          <TextField
            label="Village Tract P-Code"
            {...register("vt_pcode", {
              required: "Village tract P-Code is required.",
            })}
            error={Boolean(errors.vt_pcode)}
            helperText={errors.vt_pcode?.message}
          />
          <TextField
            label="Village Tract (Myanmar)"
            {...register("village_tract_mya_mm3")}
          />
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
