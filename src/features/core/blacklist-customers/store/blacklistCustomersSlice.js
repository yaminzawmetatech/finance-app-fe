import createSharedSlice from "../../shared-slice/store/createSharedSlice";
import blacklistCustomersService from "../services/blacklistCustomersService";

const blacklistCustomersSlice = createSharedSlice(
  "blacklistCustomers",
  blacklistCustomersService
);

export const fetchBlacklistCustomers = blacklistCustomersSlice.thunks.fetch;
export const createBlacklistCustomer = blacklistCustomersSlice.thunks.create;
export const updateBlacklistCustomer = blacklistCustomersSlice.thunks.update;
export const deleteBlacklistCustomer = blacklistCustomersSlice.thunks.delete;
export const batchDeleteBlacklistCustomers =
  blacklistCustomersSlice.thunks.batchDelete;
export const importBlacklistCustomers =
  blacklistCustomersSlice.thunks.importFile;

export default blacklistCustomersSlice.reducer;
