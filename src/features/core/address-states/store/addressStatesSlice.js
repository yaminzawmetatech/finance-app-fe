import createSharedSlice from "../../shared-slice/store/createSharedSlice";
import addressStatesService from "../services/addressStatesService";

const addressStatesSlice = createSharedSlice(
  "addressStates",
  addressStatesService
);

export const fetchAddressStates = addressStatesSlice.thunks.fetch;
export const createAddressState = addressStatesSlice.thunks.create;
export const updateAddressState = addressStatesSlice.thunks.update;
export const deleteAddressState = addressStatesSlice.thunks.delete;
export const importAddressStates = addressStatesSlice.thunks.importFile;

export default addressStatesSlice.reducer;
