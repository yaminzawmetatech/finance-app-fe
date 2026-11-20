import createSharedSlice from "../../shared-slice/store/createSharedSlice";
import dealersService from "../services/dealersService";

const dealersSlice = createSharedSlice("dealers", dealersService);

export const fetchDealers = dealersSlice.thunks.fetch;
export const createDealer = dealersSlice.thunks.create;
export const updateDealer = dealersSlice.thunks.update;
export const deleteDealer = dealersSlice.thunks.delete;

export default dealersSlice.reducer;
