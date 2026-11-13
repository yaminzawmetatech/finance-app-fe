import createSharedSlice from "../../shared-slice/store/createSharedSlice";
import addressVillageTractsService from "../services/addressVillageTractsService";

const addressVillageTractsSlice = createSharedSlice(
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
