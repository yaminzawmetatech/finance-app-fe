import createAddressSlice from "../../address-common/store/createAddressSlice";
import addressVillagesService from "../services/addressVillagesService";

const addressVillagesSlice = createAddressSlice(
  "addressVillages",
  addressVillagesService
);

export const fetchAddressVillages = addressVillagesSlice.thunks.fetch;
export const createAddressVillage = addressVillagesSlice.thunks.create;
export const updateAddressVillage = addressVillagesSlice.thunks.update;
export const deleteAddressVillage = addressVillagesSlice.thunks.delete;
export const importAddressVillages = addressVillagesSlice.thunks.importFile;

export default addressVillagesSlice.reducer;
