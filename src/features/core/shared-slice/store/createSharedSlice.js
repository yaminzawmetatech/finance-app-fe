import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const getItems = (response) => {
  const payload = response?.data ?? response;
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
};

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
  return "Unable to complete address request.";
};

export default function createSharedSlice(name, service) {
  const createRequest = (operation, request) =>
    createAsyncThunk(`${name}/${operation}`, async (args, thunkAPI) => {
      try {
        return await request(args);
      } catch (error) {
        return thunkAPI.rejectWithValue(getErrorMessage(error));
      }
    });

  const thunks = {
    fetch: createRequest("fetch", async (params) =>
      getItems(await service.getAll(params))
    ),
    create: createRequest("create", (data) => service.create(data)),
    update: createRequest("update", ({ uuid, data }) =>
      service.update(uuid, data)
    ),
    delete: createRequest("delete", (uuid) => service.delete(uuid)),
    importFile: createRequest("import", (file) => service.importFile(file)),
  };

  if (service.batchDelete) {
    thunks.batchDelete = createRequest("batchDelete", (uuids) =>
      service.batchDelete(uuids)
    );
  }

  const mutationThunks = [
    thunks.create,
    thunks.update,
    thunks.delete,
    thunks.batchDelete,
  ].filter(Boolean);

  const slice = createSlice({
    name,
    initialState: {
      items: [],
      isLoading: true,
      isSaving: false,
      isImporting: false,
    },
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(thunks.fetch.pending, (state) => {
          state.isLoading = true;
        })
        .addCase(thunks.fetch.fulfilled, (state, action) => {
          state.items = action.payload;
          state.isLoading = false;
        })
        .addCase(thunks.fetch.rejected, (state) => {
          state.isLoading = false;
        })
        .addCase(thunks.importFile.pending, (state) => {
          state.isImporting = true;
        })
        .addCase(thunks.importFile.fulfilled, (state) => {
          state.isImporting = false;
        })
        .addCase(thunks.importFile.rejected, (state) => {
          state.isImporting = false;
        });

      mutationThunks.forEach((thunk) => {
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

  return { reducer: slice.reducer, thunks };
}
