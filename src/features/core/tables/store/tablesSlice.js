import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import tablesService from "../services/tablesService";

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
  return "Unable to complete table request.";
};

const getItems = (response) => {
  const payload = response?.data ?? response;
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  throw new Error("Unexpected response format when loading tables.");
};

const createRequest = (type, operation) =>
  createAsyncThunk(type, async (args, thunkAPI) => {
    try {
      return await operation(args);
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  });

export const fetchTables = createRequest(
  "tables/fetch",
  async (params) => getItems(await tablesService.getAll(params))
);
export const createTable = createRequest(
  "tables/create",
  tablesService.create
);
export const updateTable = createRequest(
  "tables/update",
  ({ uuid, data }) => tablesService.update(uuid, data)
);
export const deleteTable = createRequest(
  "tables/delete",
  tablesService.delete
);
export const batchDeleteTables = createRequest(
  "tables/batchDelete",
  tablesService.batchDelete
);

const tablesSlice = createSlice({
  name: "tables",
  initialState: { items: [], isLoading: true, isSaving: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTables.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchTables.fulfilled, (state, action) => {
        state.items = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchTables.rejected, (state) => {
        state.isLoading = false;
      });

    [createTable, updateTable, deleteTable, batchDeleteTables].forEach(
      (thunk) => {
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
      }
    );
  },
});

export default tablesSlice.reducer;
