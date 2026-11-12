import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import positionsService from "../services/positionsService";

const getErrorMessage = (error) => {
  const message = error.response?.data?.message ?? error.message;
  if (typeof message === "string") return message;
  if (message && typeof message === "object") {
    return Object.values(message).flat().join("\n");
  }
  return "Unable to complete position request.";
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

export const fetchPositions = createRequest(
  "positions/fetch",
  async () => getItems(await positionsService.getPositions())
);
export const createPosition = createRequest(
  "positions/create",
  positionsService.createPosition
);
export const updatePosition = createRequest(
  "positions/update",
  ({ uuid, data }) => positionsService.updatePosition(uuid, data)
);
export const deletePosition = createRequest(
  "positions/delete",
  positionsService.deletePosition
);

const positionsSlice = createSlice({
  name: "positions",
  initialState: { items: [], isLoading: true, isSaving: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPositions.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchPositions.fulfilled, (state, action) => {
        state.items = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchPositions.rejected, (state) => {
        state.isLoading = false;
      });

    [createPosition, updatePosition, deletePosition].forEach((thunk) => {
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

export default positionsSlice.reducer;
