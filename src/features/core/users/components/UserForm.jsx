import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
} from "@mui/material";

import { useEffect } from "react";
import { useForm } from "react-hook-form";

const UserForm = ({
  open,
  onClose,
  onSubmit,
  editData,
  isLoading,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      password_confirmation: "",
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        name: editData?.name ?? "",
        email: editData?.email ?? "",
        phone: editData?.phone ?? "",
        password: "",
        password_confirmation: "",
      });
    }
  }, [open, editData, reset]);

  const submitForm = async (data) => {
    const payload = { ...data };

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
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="User Name"
                {...register("user_name", {
                  required: "User name is required",
                })}
                error={!!errors.user_name}
                helperText={errors.user_name?.message}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                {...register("office_email", {
                  required: "Email is required",
                })}
                error={!!errors.office_email}
                helperText={errors.office_email?.message}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Phone"
                {...register("phone")}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Password"
                type="password"
                {...register("password", {
                  required: !editData
                    ? "Password is required"
                    : false,
                })}
                error={!!errors.password}
                helperText={errors.password?.message}
              />
            </Grid>

            <Grid item xs={12}>
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
                helperText={
                  errors.password_confirmation?.message
                }
              />
            </Grid>
          </Grid>
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