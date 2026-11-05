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
import addressVillageTractsService from "../../address-village-tracts/services/addressVillageTractsService";
import { showErrorToast } from "../../../../components/common/ToastMessage";

const getItems = (response) => {
  const payload = response?.data ?? response;
  return Array.isArray(payload) ? payload : Array.isArray(payload?.data) ? payload.data : [];
};

const EMPTY_VILLAGE = {
  name: "",
  village_pcode: "",
  village_mya_mmr3: "",
  address_village_tract_id: "",
  description: "",
  is_blacklisted: false,
};

export default function AddressVillageForm({
  open,
  onClose,
  onSubmit,
  editData,
  isLoading,
}) {
  const [villageTracts, setVillageTracts] = useState([]);
  const { control, register, handleSubmit, reset } = useForm({
    defaultValues: EMPTY_VILLAGE,
  });

  useEffect(() => {
    let active = true;
    addressVillageTractsService
      .getAll()
      .then((response) => {
        if (active) setVillageTracts(getItems(response));
      })
      .catch((error) =>
        showErrorToast(error.message || "Unable to load village tracts.")
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
            ...EMPTY_VILLAGE,
            ...editData,
            address_village_tract_id:
              editData.address_village_tract_id ?? "",
            description:
              editData.description === "---" ? "" : editData.description || "",
          }
        : EMPTY_VILLAGE
    );
  }, [open, editData, reset]);

  return (
    <Dialog open={open} onClose={() => !isLoading && onClose()} fullWidth maxWidth="sm">
      <DialogTitle>
        {editData ? "Edit Address Village" : "Create Address Village"}
      </DialogTitle>
      <form
        onSubmit={handleSubmit((values) => {
          const villageTract = villageTracts.find(
            (item) =>
              String(item.id) === String(values.address_village_tract_id)
          );
          return onSubmit({
            ...values,
            vt_pcode: villageTract?.vt_pcode || "",
            address_village_tract_id: Number(values.address_village_tract_id),
          });
        })}
      >
        <DialogContent sx={{ display: "grid", gap: 2, pt: 1 }}>
          <Controller
            name="address_village_tract_id"
            control={control}
            rules={{ required: "Village tract is required." }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                select
                label="Village Tract"
                value={field.value ?? ""}
                error={Boolean(fieldState.error)}
                helperText={fieldState.error?.message}
              >
                {villageTracts.map((tract) => (
                  <MenuItem key={tract.id} value={String(tract.id)}>
                    {tract.name} ({tract.vt_pcode})
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
          <TextField
            label="Village Name"
            {...register("name", { required: "Village name is required." })}
          />
          <TextField
            label="Village P-Code"
            {...register("village_pcode", {
              required: "Village P-Code is required.",
            })}
          />
          <TextField label="Village (Myanmar)" {...register("village_mya_mmr3")} />
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
