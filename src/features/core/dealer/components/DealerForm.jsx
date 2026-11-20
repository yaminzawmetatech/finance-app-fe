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
import addressTownshipsService from "../../address-townships/services/addressTownshipsService";
import dealerGroupsService from "../../dealer-group/services/dealerGroupsService";
import { showErrorToast } from "../../../../components/common/ToastMessage";

const getItems = (response) => {
  const payload = response?.data ?? response;
  return Array.isArray(payload) ? payload : Array.isArray(payload?.data) ? payload.data : [];
};

const EMPTY_DEALER = {
  name: "",
  owner_name: "",
  description: "",
  state_id: "",
  district_id: "",
  township_id: "",
  showroom_address: "",
  showroom_ph_no: "",
  dealer_contract_signed_date: "",
  dealer_type: "",
  selling_product_type: "",
  commission_percentage: "",
  dealer_discount_percentage: "",
  direct_marketing_commission_percentage: "",
  operating_starting_date: "",
  printer: "",
  printer_fixed_asset: "",
  printer_available: false,
  dealer_group_id: "",
  in_active: false,
  is_active: true,
};

export default function DealerForm({
  open,
  onClose,
  onSubmit,
  editData,
  isLoading,
}) {
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [townships, setTownships] = useState([]);
  const [dealerGroups, setDealerGroups] = useState([]);
  const { control, register, handleSubmit, reset, setValue } = useForm({
    defaultValues: EMPTY_DEALER,
  });
  const selectedStateId = useWatch({ control, name: "state_id" });
  const selectedDistrictId = useWatch({ control, name: "district_id" });

  useEffect(() => {
    let active = true;
    Promise.all([
      addressStatesService.getAll(),
      addressDistrictsService.getAll(),
      addressTownshipsService.getAll(),
      dealerGroupsService.getAll(),
    ])
      .then(([statesResponse, districtsResponse, townshipsResponse, groupsResponse]) => {
        if (!active) return;
        setStates(getItems(statesResponse));
        setDistricts(getItems(districtsResponse));
        setTownships(getItems(townshipsResponse));
        setDealerGroups(getItems(groupsResponse));
      })
      .catch((error) =>
        showErrorToast(error.message || "Unable to load dealer setup options.")
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
            ...EMPTY_DEALER,
            ...editData,
            description: editData.description === "---" ? "" : editData.description || "",
            state_id: editData.state_id ?? "",
            district_id: editData.district_id ?? "",
            township_id: editData.township_id ?? "",
            dealer_group_id: editData.dealer_group_id ?? "",
            printer_available: Boolean(editData.printer_available),
            in_active: Boolean(editData.in_active),
          }
        : EMPTY_DEALER
    );
  }, [open, editData, reset]);

  const filteredDistricts = useMemo(
    () => districts.filter((district) =>
      String(district.address_state_id) === String(selectedStateId)
    ),
    [districts, selectedStateId]
  );
  const filteredTownships = useMemo(
    () => townships.filter((township) =>
      String(township.address_district_id) === String(selectedDistrictId)
    ),
    [townships, selectedDistrictId]
  );

  const submitForm = (values) => {
    const numericIds = ["state_id", "district_id", "township_id", "dealer_group_id"];
    const payload = { ...values };
    numericIds.forEach((field) => {
      payload[field] = values[field] === "" ? null : Number(values[field]);
    });
    ["commission_percentage", "dealer_discount_percentage", "direct_marketing_commission_percentage"]
      .forEach((field) => {
        payload[field] = values[field] === "" ? null : Number(values[field]);
      });
    onSubmit(payload);
  };

  return (
    <Dialog open={open} onClose={() => !isLoading && onClose()} fullWidth maxWidth="md">
      <DialogTitle>{editData ? "Edit Dealer" : "Create Dealer"}</DialogTitle>
      <form onSubmit={handleSubmit(submitForm)}>
        <DialogContent sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, pt: 1 }}>
          <TextField
            label="Dealer Name"
            {...register("name", { required: "Dealer name is required." })}
            sx={{ gridColumn: "1 / -1" }}
          />
          <TextField label="Owner Name" {...register("owner_name")} />
          <Controller
            name="dealer_group_id"
            control={control}
            render={({ field }) => (
              <TextField {...field} select label="Dealer Group" value={field.value ?? ""}>
                {dealerGroups.map((group) => (
                  <MenuItem key={group.id} value={String(group.id)}>{group.name}</MenuItem>
                ))}
              </TextField>
            )}
          />
          <Controller
            name="state_id"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                select
                label="State / Region"
                value={field.value ?? ""}
                onChange={(event) => {
                  field.onChange(event);
                  setValue("district_id", "");
                  setValue("township_id", "");
                }}
              >
                {states.map((state) => (
                  <MenuItem key={state.id} value={String(state.id)}>{state.name}</MenuItem>
                ))}
              </TextField>
            )}
          />
          <Controller
            name="district_id"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                select
                label="District"
                value={field.value ?? ""}
                disabled={!selectedStateId}
                onChange={(event) => {
                  field.onChange(event);
                  setValue("township_id", "");
                }}
              >
                {filteredDistricts.map((district) => (
                  <MenuItem key={district.id} value={String(district.id)}>{district.name}</MenuItem>
                ))}
              </TextField>
            )}
          />
          <Controller
            name="township_id"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                select
                label="Township"
                value={field.value ?? ""}
                disabled={!selectedDistrictId}
              >
                {filteredTownships.map((township) => (
                  <MenuItem key={township.id} value={String(township.id)}>{township.name}</MenuItem>
                ))}
              </TextField>
            )}
          />
          <TextField label="Showroom Address" {...register("showroom_address",{ required: "Showroom address is required." })} />
          <TextField label="Showroom Phone" {...register("showroom_ph_no",{ required: "Showroom phone is required." })} />
          <TextField label="Dealer Type" {...register("dealer_type",{ required: "Dealer type is required." })} />
          <TextField label="Selling Product Type" {...register("selling_product_type")} />
          <TextField
            label="Contract Signed Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            {...register("dealer_contract_signed_date")}
          />
          <TextField
            label="Operating Starting Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            {...register("operating_starting_date")}
          />
          <TextField
            label="Commission Percentage"
            type="number"
            inputProps={{ step: "0.01" }}
            {...register("commission_percentage")}
          />
          <TextField
            label="Dealer Discount Percentage"
            type="number"
            inputProps={{ step: "0.01" }}
            {...register("dealer_discount_percentage")}
          />
          <TextField
            label="Direct Marketing Commission Percentage"
            type="number"
            inputProps={{ step: "0.01" }}
            {...register("direct_marketing_commission_percentage")}
          />
          <TextField label="Printer" {...register("printer")} />
          <TextField label="Printer Fixed Asset" {...register("printer_fixed_asset")} />
          <TextField
            label="Description"
            multiline
            minRows={2}
            {...register("description")}
            sx={{ gridColumn: "1 / -1" }}
          />
          <FormControlLabel
            label="Printer Available"
            control={
              <Controller
                name="printer_available"
                control={control}
                render={({ field }) => (
                  <Switch checked={Boolean(field.value)} onChange={(event) => field.onChange(event.target.checked)} />
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
