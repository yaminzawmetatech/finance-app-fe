import createSharedSlice from "../../shared-slice/store/createSharedSlice";
import dealerGroupsService from "../services/dealerGroupsService";

const dealerGroupsSlice = createSharedSlice(
  "dealerGroups",
  dealerGroupsService
);

export const fetchDealerGroups = dealerGroupsSlice.thunks.fetch;
export const createDealerGroup = dealerGroupsSlice.thunks.create;
export const updateDealerGroup = dealerGroupsSlice.thunks.update;
export const deleteDealerGroup = dealerGroupsSlice.thunks.delete;

export default dealerGroupsSlice.reducer;
