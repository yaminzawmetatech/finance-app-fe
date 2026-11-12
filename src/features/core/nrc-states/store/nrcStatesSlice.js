import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import nrcStatesService from "../services/nrcStatesService";

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
  return "Unable to complete NRC state request.";
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

export const fetchNrcStates = createRequest(
  "nrcStates/fetch",
  async () => getItems(await nrcStatesService.getStates())
);
export const createNrcState = createRequest(
  "nrcStates/create",
  nrcStatesService.createState
);
export const updateNrcState = createRequest(
  "nrcStates/update",
  ({ uuid, data }) => nrcStatesService.updateState(uuid, data)
);
export const deleteNrcState = createRequest(
  "nrcStates/delete",
  nrcStatesService.deleteState
);
export const batchDeleteNrcStates = createRequest(
  "nrcStates/batchDelete",
  nrcStatesService.batchDeleteStates
);
export const importNrcStates = createRequest(
  "nrcStates/import",
  nrcStatesService.importStates
);

const initialState = {
  items: [],
  isLoading: true,
  isSaving: false,
  isImporting: false,
};

const nrcStatesSlice = createSlice({
  name: "nrcStates",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNrcStates.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchNrcStates.fulfilled, (state, action) => {
        state.items = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchNrcStates.rejected, (state) => {
        state.isLoading = false;
      });

    [createNrcState, updateNrcState, deleteNrcState, batchDeleteNrcStates]
      .forEach((thunk) => {
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

    builder
      .addCase(importNrcStates.pending, (state) => {
        state.isImporting = true;
      })
      .addCase(importNrcStates.fulfilled, (state) => {
        state.isImporting = false;
      })
      .addCase(importNrcStates.rejected, (state) => {
        state.isImporting = false;
      });
  },
});

export default nrcStatesSlice.reducer;
