import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import nrcTownshipsService from "../services/nrcTownshipsService";

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
  return "Unable to complete NRC township request.";
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

export const fetchNrcTownships = createRequest(
  "nrcTownships/fetch",
  async () => getItems(await nrcTownshipsService.getTownships())
);
export const createNrcTownship = createRequest(
  "nrcTownships/create",
  nrcTownshipsService.createTownship
);
export const updateNrcTownship = createRequest(
  "nrcTownships/update",
  ({ uuid, data }) => nrcTownshipsService.updateTownship(uuid, data)
);
export const deleteNrcTownship = createRequest(
  "nrcTownships/delete",
  nrcTownshipsService.deleteTownship
);
export const batchDeleteNrcTownships = createRequest(
  "nrcTownships/batchDelete",
  nrcTownshipsService.batchDeleteTownships
);
export const importNrcTownships = createRequest(
  "nrcTownships/import",
  nrcTownshipsService.importTownships
);

const nrcTownshipsSlice = createSlice({
  name: "nrcTownships",
  initialState: {
    items: [],
    isLoading: true,
    isSaving: false,
    isImporting: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNrcTownships.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchNrcTownships.fulfilled, (state, action) => {
        state.items = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchNrcTownships.rejected, (state) => {
        state.isLoading = false;
      });

    [createNrcTownship, updateNrcTownship, deleteNrcTownship, batchDeleteNrcTownships]
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
      .addCase(importNrcTownships.pending, (state) => {
        state.isImporting = true;
      })
      .addCase(importNrcTownships.fulfilled, (state) => {
        state.isImporting = false;
      })
      .addCase(importNrcTownships.rejected, (state) => {
        state.isImporting = false;
      });
  },
});

export default nrcTownshipsSlice.reducer;
