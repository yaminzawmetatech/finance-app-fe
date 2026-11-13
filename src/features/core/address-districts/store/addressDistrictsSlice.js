import createSharedSlice from "../../shared-slice/store/createSharedSlice";
import addressDistrictsService from "../services/addressDistrictsService";

const addressDistrictsSlice = createSharedSlice(
  "addressDistricts",
  addressDistrictsService
);

export const fetchAddressDistricts = addressDistrictsSlice.thunks.fetch;
export const createAddressDistrict = addressDistrictsSlice.thunks.create;
export const updateAddressDistrict = addressDistrictsSlice.thunks.update;
export const deleteAddressDistrict = addressDistrictsSlice.thunks.delete;
export const batchDeleteAddressDistricts =
  addressDistrictsSlice.thunks.batchDelete;
export const importAddressDistricts = addressDistrictsSlice.thunks.importFile;

export default addressDistrictsSlice.reducer;
