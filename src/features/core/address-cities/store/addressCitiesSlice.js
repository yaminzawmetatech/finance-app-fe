import createSharedSlice from "../../shared-slice/store/createSharedSlice";
import addressCitiesService from "../services/addressCitiesService";

const addressCitiesSlice = createSharedSlice(
  "addressCities",
  addressCitiesService
);

export const fetchAddressCities = addressCitiesSlice.thunks.fetch;
export const createAddressCity = addressCitiesSlice.thunks.create;
export const updateAddressCity = addressCitiesSlice.thunks.update;
export const deleteAddressCity = addressCitiesSlice.thunks.delete;
export const batchDeleteAddressCities = addressCitiesSlice.thunks.batchDelete;
export const importAddressCities = addressCitiesSlice.thunks.importFile;

export default addressCitiesSlice.reducer;
