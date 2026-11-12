import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import rolesService from "../services/rolesService";

const getErrorMessage = (error) => {
  const message = error.response?.data?.message ?? error.message;
  if (typeof message === "string") return message;
  if (message && typeof message === "object") {
    return Object.entries(message)
      .flatMap(([field, errors]) =>
        (Array.isArray(errors) ? errors : [errors]).map(
          (item) => `${field}: ${item}`
        )
      )
      .join("\n");
  }
  return "Unable to complete role request.";
};

const getItems = (response) => {
  const payload = response?.data ?? response;
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
};

const createRequest = (type, operation) =>
  createAsyncThunk(type, async (args, thunkAPI) => {
    try {
      return await operation(args);
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  });

export const fetchRoles = createRequest(
  "roles/fetch",
  async () => getItems(await rolesService.getUserGroups())
);
export const fetchRolePermissions = createRequest(
  "roles/fetchPermissions",
  async () => getItems(await rolesService.getPermissions())
);
export const createRole = createRequest(
  "roles/create",
  rolesService.createUserGroup
);
export const updateRole = createRequest(
  "roles/update",
  ({ uuid, data }) => rolesService.updateUserGroup(uuid, data)
);
export const deleteRole = createRequest(
  "roles/delete",
  rolesService.deleteUserGroup
);

const rolesSlice = createSlice({
  name: "roles",
  initialState: {
    items: [],
    permissions: [],
    isLoading: true,
    isLoadingPermissions: true,
    isSaving: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRoles.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchRoles.fulfilled, (state, action) => {
        state.items = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchRoles.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(fetchRolePermissions.pending, (state) => {
        state.isLoadingPermissions = true;
      })
      .addCase(fetchRolePermissions.fulfilled, (state, action) => {
        state.permissions = action.payload;
        state.isLoadingPermissions = false;
      })
      .addCase(fetchRolePermissions.rejected, (state) => {
        state.isLoadingPermissions = false;
      });

    [createRole, updateRole, deleteRole].forEach((thunk) => {
      builder
        .addCase(thunk.pending, (state) => {
          state.isSaving = true;
        })
        .addCase(thunk.fulfilled, (state) => {
          state.isSaving = false;
        })
        .addCase(thunk.rejected, (state) => {
          state.isSaving = false;
        });
    });
  },
});

export default rolesSlice.reducer;
