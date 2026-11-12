import createAddressSlice from "../../address-common/store/createAddressSlice";
import addressVillageTractsService from "../services/addressVillageTractsService";

const addressVillageTractsSlice = createAddressSlice(
  "addressVillageTracts",
  addressVillageTractsService
);

export const fetchAddressVillageTracts =
  addressVillageTractsSlice.thunks.fetch;
export const createAddressVillageTract =
  addressVillageTractsSlice.thunks.create;
export const updateAddressVillageTract =
  addressVillageTractsSlice.thunks.update;
export const deleteAddressVillageTract =
  addressVillageTractsSlice.thunks.delete;
export const importAddressVillageTracts =
  addressVillageTractsSlice.thunks.importFile;

export default addressVillageTractsSlice.reducer;
