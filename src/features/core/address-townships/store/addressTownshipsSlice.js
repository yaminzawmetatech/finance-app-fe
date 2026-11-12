import createAddressSlice from "../../address-common/store/createAddressSlice";
import addressTownshipsService from "../services/addressTownshipsService";

const addressTownshipsSlice = createAddressSlice(
  "addressTownships",
  addressTownshipsService
);

export const fetchAddressTownships = addressTownshipsSlice.thunks.fetch;
export const createAddressTownship = addressTownshipsSlice.thunks.create;
export const updateAddressTownship = addressTownshipsSlice.thunks.update;
export const deleteAddressTownship = addressTownshipsSlice.thunks.delete;
export const batchDeleteAddressTownships =
  addressTownshipsSlice.thunks.batchDelete;
export const importAddressTownships = addressTownshipsSlice.thunks.importFile;

export default addressTownshipsSlice.reducer;
