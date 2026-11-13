import createSharedSlice from "../../shared-slice/store/createSharedSlice";
import addressWardsService from "../services/addressWardsService";

const addressWardsSlice = createSharedSlice(
  "addressWards",
  addressWardsService
);

export const fetchAddressWards = addressWardsSlice.thunks.fetch;
export const createAddressWard = addressWardsSlice.thunks.create;
export const updateAddressWard = addressWardsSlice.thunks.update;
export const deleteAddressWard = addressWardsSlice.thunks.delete;
export const batchDeleteAddressWards = addressWardsSlice.thunks.batchDelete;
export const importAddressWards = addressWardsSlice.thunks.importFile;

export default addressWardsSlice.reducer;
