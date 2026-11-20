import { useEffect, useMemo, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { Controller, useForm, useWatch } from "react-hook-form";
import addressCitiesService from "../../address-cities/services/addressCitiesService";
import addressDistrictsService from "../../address-districts/services/addressDistrictsService";
import addressStatesService from "../../address-states/services/addressStatesService";
import addressTownshipsService from "../../address-townships/services/addressTownshipsService";
import addressVillageTractsService from "../../address-village-tracts/services/addressVillageTractsService";
import addressVillagesService from "../../address-villages/services/addressVillagesService";
import addressWardsService from "../../address-wards/services/addressWardsService";
import nrcStatesService from "../../nrc-states/services/nrcStatesService";
import nrcTownshipsService from "../../nrc-townships/services/nrcTownshipsService";
import blacklistCustomersService from "../services/blacklistCustomersService";
import { showErrorToast } from "../../../../components/common/ToastMessage";

const EMPTY_CUSTOMER = {
  black_list_customer_code: "",
  black_list_customer_name: "",
  father_name: "",
  full_nrc: "",
  nrc_state_id: "",
  nrc_township_id: "",
  nrc_remark: "",
  nrc_number: "",
  passport_no: "",
  full_address: "",
  address_state_id: "",
  address_district_id: "",
  address_township_id: "",
  address_city_id: "",
  address_ward_id: "",
  address_village_tract_id: "",
  address_village_id: "",
  address_street: "",
  nationality: "",
  entity_and_other_groups: "",
  source: "",
  contract_id: "",
  removal_type: "",
  description: "",
};

const getItems = (response) => {
  const payload = response?.data ?? response;
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
};

const formatOption = (option) =>
  option.name ||
  option.state_name ||
  option.township_name ||
  option.label ||
  String(option.id);

export default function BlacklistCustomerForm({
  open,
  onClose,
  onSubmit,
  editData,
  isLoading,
  nrcRemarks = [],
}) {
  const [lookups, setLookups] = useState({
    nrcStates: [],
    nrcTownships: [],
    addressStates: [],
    addressDistricts: [],
    addressTownships: [],
    addressCities: [],
    addressWards: [],
    addressVillageTracts: [],
    addressVillages: [],
  });
  const [remarks, setRemarks] = useState(nrcRemarks);
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({ defaultValues: EMPTY_CUSTOMER });
  const selectedAddressTownshipId = useWatch({
    control,
    name: "address_township_id",
  });

  const filteredCities = useMemo(
    () =>
      lookups.addressCities.filter(
        (city) =>
          !city.address_township_id ||
          String(city.address_township_id) ===
            String(selectedAddressTownshipId)
      ),
    [lookups.addressCities, selectedAddressTownshipId]
  );

  useEffect(() => {
    let active = true;
    Promise.all([
      nrcStatesService.getStates(),
      nrcTownshipsService.getTownships(),
      addressStatesService.getAll(),
      addressDistrictsService.getAll(),
      addressTownshipsService.getAll(),
      addressCitiesService.getAll(),
      addressWardsService.getAll(),
      addressVillageTractsService.getAll(),
      addressVillagesService.getAll(),
      blacklistCustomersService.getNrcRemarks(),
    ])
      .then((responses) => {
        if (!active) return;
        const [
          nrcStates,
          nrcTownships,
          addressStates,
          addressDistricts,
          addressTownships,
          addressCities,
          addressWards,
          addressVillageTracts,
          addressVillages,
          nrcRemarks,
        ] = responses;
        setLookups({
          nrcStates: getItems(nrcStates),
          nrcTownships: getItems(nrcTownships),
          addressStates: getItems(addressStates),
          addressDistricts: getItems(addressDistricts),
          addressTownships: getItems(addressTownships),
          addressCities: getItems(addressCities),
          addressWards: getItems(addressWards),
          addressVillageTracts: getItems(addressVillageTracts),
          addressVillages: getItems(addressVillages),
        });
        setRemarks(getItems(nrcRemarks));
      })
      .catch((error) => {
        if (active) {
          showErrorToast(error.message || "Unable to load customer form options.");
        }
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const values = editData
      ? Object.fromEntries(
          Object.keys(EMPTY_CUSTOMER).map((field) => [
            field,
            editData[field] === "---" ? "" : editData[field] ?? "",
          ])
        )
      : EMPTY_CUSTOMER;
    reset(values);
  }, [open, editData, reset]);

  const submitForm = (values) => {
    const payload = { ...values };
    [
      "nrc_state_id",
      "nrc_township_id",
      "address_state_id",
      "address_district_id",
      "address_township_id",
      "address_city_id",
      "address_ward_id",
      "address_village_tract_id",
      "address_village_id",
    ].forEach((field) => {
      payload[field] = values[field] ? Number(values[field]) : null;
    });
    payload.nrc_number = values.nrc_number
      ? Number(values.nrc_number)
      : null;

    return onSubmit(payload);
  };

  const renderLookup = (name, label, options, optionLabel = formatOption) => (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <TextField
          {...field}
          select
          fullWidth
          label={label}
          value={field.value ?? ""}
        >
          <MenuItem value="">None</MenuItem>
          {options.map((option) => (
            <MenuItem
              key={option.id ?? option.key}
              value={String(option.id ?? option.key)}
            >
              {optionLabel(option)}
            </MenuItem>
          ))}
        </TextField>
      )}
    />
  );

  return (
    <Dialog
      open={open}
      onClose={() => !isLoading && onClose()}
      fullWidth
      maxWidth="md"
      scroll="paper"
    >
      <DialogTitle>
        {editData ? "Edit Blacklist Customer" : "Create Blacklist Customer"}
      </DialogTitle>
      <form onSubmit={handleSubmit(submitForm)}>
        <DialogContent sx={{ pt: 1 }}>
          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
            Customer
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Customer Code"
                fullWidth
                {...register("black_list_customer_code", {
                  required: "Customer code is required.",
                })}
                error={Boolean(errors.black_list_customer_code)}
                helperText={errors.black_list_customer_code?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Customer Name"
                fullWidth
                {...register("black_list_customer_name", {
                  required: "Customer name is required.",
                })}
                error={Boolean(errors.black_list_customer_name)}
                helperText={errors.black_list_customer_name?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Father Name" fullWidth {...register("father_name")} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Passport No." fullWidth {...register("passport_no")} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Full NRC" fullWidth {...register("full_nrc")} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="NRC Number" fullWidth {...register("nrc_number")} />
            </Grid>
            <Grid item xs={12} sm={6}>
              {renderLookup(
                "nrc_state_id",
                "NRC State",
                lookups.nrcStates,
                (option) =>
                  `${option.state_code ?? ""} ${formatOption(option)}`.trim()
              )}
            </Grid>
            <Grid item xs={12} sm={6}>
              {renderLookup(
                "nrc_township_id",
                "NRC Township",
                lookups.nrcTownships,
                (option) =>
                  `${option.township_nrc_code ?? ""} ${formatOption(option)}`.trim()
              )}
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="nrc_remark"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="NRC Remark"
                    fullWidth
                    value={field.value ?? ""}
                  >
                    <MenuItem value="">None</MenuItem>
                    {remarks.map((remark) => (
                      <MenuItem key={remark.key} value={remark.key}>
                        {remark.name ||
                          remark.label ||
                          remark.value ||
                          remark.key}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Nationality" fullWidth {...register("nationality")} />
            </Grid>
          </Grid>

          <Typography variant="subtitle1" sx={{ mt: 3, mb: 1, fontWeight: 600 }}>
            Address
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Full Address"
                fullWidth
                multiline
                minRows={2}
                {...register("full_address")}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              {renderLookup("address_state_id", "State / Region", lookups.addressStates)}
            </Grid>
            <Grid item xs={12} sm={6}>
              {renderLookup("address_district_id", "District", lookups.addressDistricts)}
            </Grid>
            <Grid item xs={12} sm={6}>
              {renderLookup("address_township_id", "Township", lookups.addressTownships)}
            </Grid>
            <Grid item xs={12} sm={6}>
              {renderLookup("address_city_id", "City / Town", filteredCities)}
            </Grid>
            <Grid item xs={12} sm={6}>
              {renderLookup("address_ward_id", "Ward", lookups.addressWards)}
            </Grid>
            <Grid item xs={12} sm={6}>
              {renderLookup(
                "address_village_tract_id",
                "Village Tract",
                lookups.addressVillageTracts
              )}
            </Grid>
            <Grid item xs={12} sm={6}>
              {renderLookup("address_village_id", "Village", lookups.addressVillages)}
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Street" fullWidth {...register("address_street")} />
            </Grid>
          </Grid>

          <Typography variant="subtitle1" sx={{ mt: 3, mb: 1, fontWeight: 600 }}>
            Blacklist Details
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Entity / Other Groups"
                fullWidth
                {...register("entity_and_other_groups")}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Source" fullWidth {...register("source")} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Contract ID" fullWidth {...register("contract_id")} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Removal Type" fullWidth {...register("removal_type")} />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Description"
                fullWidth
                multiline
                minRows={2}
                {...register("description")}
              />
            </Grid>
          </Grid>
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
