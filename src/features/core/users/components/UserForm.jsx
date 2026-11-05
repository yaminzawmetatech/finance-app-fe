import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  MenuItem,
  TextField,
  Box,
} from "@mui/material";

import { useEffect } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";

const NRC_TYPES = [
  { value: "n", label: "နိုင် (N)" },
  { value: "e", label: "ဧည့် (E)" },
  { value: "p", label: "ပြု (P)" },
  { value: "c", label: "C" },
];

const parseNrc = (value) => {
  const match = String(value || "")
    .trim()
    .match(/^(\d{1,2})\/([A-Za-z]+)\(([NEPC])\)(\d{6})$/i);
  if (!match) return null;
  return {
    stateCode: match[1],
    townshipCode: match[2].toUpperCase(),
    type: match[3].toUpperCase(),
    number: match[4],
  };
};

const normalizeFormValue = (value) => (value === "---" ? "" : value ?? "");

const toNullableNumber = (value) =>
  value === "" || value == null || value === "---" ? null : Number(value);

const UserForm = ({
  open,
  onClose,
  onSubmit,
  editData,
  isLoading,
  userGroups = [],
  positions = [],
  departments = [],
  positionsLoading = false,
  departmentsLoading = false,
  nrcStates = [],
  nrcTownships = [],
  nrcLoading = false,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      user_name: "",
      personal_email: "",
      office_email: "",
      personal_phone: "",
      role_id: "",
      department_id: "",
      position_id: "",
      nrc_state_id: "",
      nrc_township_id: "",
      nrc_number: "",
      nrc_remark: "",
      password: "",
      password_confirmation: "",
    },
  });
  const selectedNrcState = useWatch({ control, name: "nrc_state_id" });
  const selectedNrcTownship = useWatch({ control, name: "nrc_township_id" });
  const selectedNrcRemark = useWatch({ control, name: "nrc_remark" });
  const selectedNrcNumber = useWatch({ control, name: "nrc_number" });
  const filteredTownships = nrcTownships.filter((township) => {
    const stateId =
      township.n_r_c_state_id ??
      township.nrc_state_id ??
      township.nrc_state?.id;
    return String(stateId) === String(selectedNrcState || "");
  });
  const hasNrcValue = Boolean(
    selectedNrcState ||
      selectedNrcTownship ||
      selectedNrcRemark ||
      selectedNrcNumber
  );
  const nrcState = nrcStates.find(
    (state) => String(state.id) === String(selectedNrcState)
  );
  const nrcTownship = nrcTownships.find(
    (township) => String(township.id) === String(selectedNrcTownship)
  );
  const formattedNrc =
    nrcState && nrcTownship && selectedNrcRemark && selectedNrcNumber
      ? `${nrcState.state_code}/${nrcTownship.township_nrc_code}(${selectedNrcRemark.toUpperCase()})${selectedNrcNumber}`
      : "";

  useEffect(() => {
    if (open) {
      const parsedNrc = parseNrc(editData?.nrc);
      const nrcStateId =
        editData?.nrc_state_id ??
        editData?.nrc_state?.id ??
        nrcStates.find(
          (state) => String(state.state_code) === parsedNrc?.stateCode
        )?.id ??
        "";
      const nrcTownshipId =
        editData?.nrc_township_id ??
        editData?.nrc_township?.id ??
        nrcTownships.find(
          (township) =>
            String(
              township.n_r_c_state_id ??
                township.nrc_state_id ??
                township.nrc_state?.id
            ) === String(nrcStateId) &&
            String(township.township_nrc_code).toUpperCase() ===
              parsedNrc?.townshipCode
        )?.id ??
        "";
      reset({
        user_name: normalizeFormValue(editData?.user_name),
        personal_email: normalizeFormValue(editData?.personal_email),
        office_email: normalizeFormValue(editData?.office_email),
        personal_phone: normalizeFormValue(editData?.personal_phone),
        role_id: normalizeFormValue(editData?.role_id ?? editData?.role?.id),
        department_id:
          normalizeFormValue(
            editData?.department_id ??
              editData?.department?.id ??
              editData?.departmentId
          ),
        position_id:
          normalizeFormValue(
            editData?.position_id ??
              editData?.position?.id ??
              editData?.positionId
          ),
        nrc_state_id: nrcStateId,
        nrc_township_id: nrcTownshipId,
        nrc_remark: normalizeFormValue(
          editData?.nrc_remark ??
            parsedNrc?.type?.toLowerCase() ??
            editData?.nrc_type
        ),
        nrc_number:
          normalizeFormValue(parsedNrc?.number ?? editData?.nrc_number),
        password: "",
        password_confirmation: "",
      });
    }
  }, [open, editData, nrcStates, nrcTownships, reset]);

  const submitForm = async (data) => {
    const formPayload = {
      ...data,
      role_id: toNullableNumber(data.role_id),
      department_id: toNullableNumber(data.department_id),
      position_id: toNullableNumber(data.position_id),
      nrc_state_id: toNullableNumber(data.nrc_state_id),
      nrc_township_id: toNullableNumber(data.nrc_township_id),
      nrc_number: data.nrc_number || null,
      nrc_remark: data.nrc_remark || null,
    };
    const payload = Object.fromEntries(
      Object.entries(formPayload).map(([key, value]) => [
        key,
        value === "---" ? null : value,
      ])
    );
    if (!payload.password) {
      delete payload.password;
      delete payload.password_confirmation;
    }

    await onSubmit(payload);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>
        {editData ? "Edit User" : "Create New User"}
      </DialogTitle>

      <form onSubmit={handleSubmit(submitForm)}>
        <DialogContent>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "minmax(0, 1fr)",
                sm: "repeat(2, minmax(0, 1fr))",
              },
              gap: 2,
              mt: 0.5,
            }}
          >
            <TextField
              fullWidth
              label="User Name"
              {...register("user_name", {
                required: "User name is required",
              })}
              error={!!errors.user_name}
              helperText={errors.user_name?.message}
            />

            <TextField
              fullWidth
              label="Personal email"
              type="email"
              {...register("personal_email", {
                required: "Personal email is required",
              })}
              error={!!errors.personal_email}
              helperText={errors.personal_email?.message}
            />

            <TextField
              fullWidth
              label="Office email"
              type="email"
              {...register("office_email")}
            />

            <TextField
              fullWidth
              label="Phone"
              {...register("personal_phone")}
            />

            <Controller
              name="role_id"
              control={control}
              rules={{ required: "User group is required" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  fullWidth
                  label="User group"
                  value={field.value == null ? "" : String(field.value)}
                  error={!!errors.role_id}
                  helperText={errors.role_id?.message}
                >
                  <MenuItem value="" disabled>
                    Select user group
                  </MenuItem>
                  {userGroups.map((group) => (
                    <MenuItem key={group.id} value={String(group.id)}>
                      {group.name}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />

            <Controller
              name="department_id"
              control={control}
              rules={{ required: "Department is required" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  fullWidth
                  label="Department"
                  value={field.value == null ? "" : String(field.value)}
                  disabled={departmentsLoading}
                  error={!!errors.department_id}
                  helperText={
                    errors.department_id?.message ||
                    (departmentsLoading
                      ? "Loading departments..."
                      : !departments.length
                        ? "No departments available"
                        : "")
                  }
                >
                  <MenuItem value="" disabled>
                    {departmentsLoading
                      ? "Loading departments..."
                      : "Select department"}
                  </MenuItem>
                  {departments.map((department) => (
                    <MenuItem
                      key={department.id}
                      value={String(department.id)}
                    >
                      {department.name}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />

            <Controller
              name="position_id"
              control={control}
              rules={{ required: "Position is required" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  fullWidth
                  label="Position"
                  value={field.value == null ? "" : String(field.value)}
                  disabled={positionsLoading}
                  error={!!errors.position_id}
                  helperText={
                    errors.position_id?.message ||
                    (positionsLoading
                      ? "Loading positions..."
                      : !positions.length
                        ? "No positions available"
                        : "")
                  }
                >
                  <MenuItem value="" disabled>
                    {positionsLoading
                      ? "Loading positions..."
                      : "Select position"}
                  </MenuItem>
                  {positions.map((position) => (
                    <MenuItem key={position.id} value={String(position.id)}>
                      {position.name}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />

            <Controller
              name="nrc_state_id"
              control={control}
              rules={{
                validate: (value) =>
                  !hasNrcValue || Boolean(value) || "NRC state is required",
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  fullWidth
                  label="NRC State"
                  onChange={(event) => {
                    field.onChange(event);
                    setValue("nrc_township_id", "");
                  }}
                  value={field.value == null ? "" : String(field.value)}
                  disabled={nrcLoading}
                  error={!!errors.nrc_state_id}
                  helperText={
                    errors.nrc_state_id?.message ||
                    (nrcLoading
                      ? "Loading NRC states..."
                      : !nrcStates.length
                        ? "No NRC states available"
                        : "")
                  }
                >
                  <MenuItem value="">
                    {nrcLoading ? "Loading NRC states..." : "Select state"}
                  </MenuItem>
                  {nrcStates.map((state) => (
                    <MenuItem key={state.id} value={String(state.id)}>
                      {state.state_code} - {state.name}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />

            <Controller
              name="nrc_township_id"
              control={control}
              rules={{
                validate: (value) =>
                  !hasNrcValue || Boolean(value) || "NRC township is required",
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  fullWidth
                  label="NRC Township"
                  value={field.value == null ? "" : String(field.value)}
                  disabled={
                    nrcLoading || !selectedNrcState || !filteredTownships.length
                  }
                  error={!!errors.nrc_township_id}
                  helperText={
                    errors.nrc_township_id?.message ||
                    (nrcLoading
                      ? "Loading NRC townships..."
                      : !selectedNrcState
                        ? "Select an NRC state first"
                        : !filteredTownships.length
                          ? "No townships available for this state"
                          : "")
                  }
                >
                  <MenuItem value="">
                    {selectedNrcState ? "Select township" : "Select state first"}
                  </MenuItem>
                  {filteredTownships.map((township) => (
                    <MenuItem key={township.id} value={String(township.id)}>
                      {township.township_nrc_code} - {township.name}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />

            <Controller
              name="nrc_remark"
              control={control}
              rules={{
                validate: (value) =>
                  !hasNrcValue || Boolean(value) || "NRC remark is required",
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  fullWidth
                  label="NRC Remark"
                  value={field.value ?? ""}
                  disabled={!selectedNrcState}
                  error={!!errors.nrc_remark}
                  helperText={errors.nrc_remark?.message}
                >
                  <MenuItem value="">Select NRC remark</MenuItem>
                  {NRC_TYPES.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />

            <TextField
              fullWidth
              label="NRC Number"
              inputProps={{ maxLength: 6, inputMode: "numeric" }}
              {...register("nrc_number", {
                validate: (value) =>
                  !value ||
                  /^\d{6}$/.test(value) ||
                  "NRC number must contain exactly 6 digits",
              })}
              error={!!errors.nrc_number}
              helperText={
                errors.nrc_number?.message || "Enter the 6-digit NRC number"
              }
            />

            <Box
              component="output"
              sx={{
                gridColumn: "1 / -1",
                display: "flex",
                alignItems: "center",
                gap: 1,
                minHeight: 40,
                px: 1.5,
                borderRadius: 1,
                bgcolor: "action.hover",
                color: "text.secondary",
                fontSize: 14,
              }}
            >
              <Box component="span" sx={{ fontWeight: 600, color: "text.primary" }}>
                NRC
              </Box>
              <Box component="span">{formattedNrc || "---"}</Box>
            </Box>

            <TextField
              fullWidth
              label="Password"
              type="password"
              {...register("password", {
                required: !editData
                  ? "Password is required"
                  : false,
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
              })}
              error={!!errors.password}
              helperText={errors.password?.message}
            />

            <TextField
              fullWidth
              label="Confirm Password"
              type="password"
              {...register("password_confirmation", {
                validate: (value, values) =>
                  !values.password ||
                  value === values.password ||
                  "Passwords do not match",
              })}
              error={!!errors.password_confirmation}
              helperText={errors.password_confirmation?.message}
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>

          <Button
            type="submit"
            variant="contained"
            disabled={isLoading}
          >
            {isLoading
              ? "Saving..."
              : editData
                ? "Update"
                : "Create"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default UserForm;