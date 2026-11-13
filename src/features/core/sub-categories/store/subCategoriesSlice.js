import createSharedSlice from "../../shared-slice/store/createSharedSlice";
import subCatgoriesService from "../services/subCategoriesService";

const subCatgoriesSlice = createSharedSlice(
  "subCategories",
  subCatgoriesService
);

export const fetchSubCatgories = subCatgoriesSlice.thunks.fetch;
export const createSubCatgory = subCatgoriesSlice.thunks.create;
export const updateSubCatgory = subCatgoriesSlice.thunks.update;
export const deleteSubCatgory = subCatgoriesSlice.thunks.delete;

export default subCatgoriesSlice.reducer;
