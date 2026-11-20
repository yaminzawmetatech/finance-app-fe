import createSharedSlice from "../../shared-slice/store/createSharedSlice";
import subBusinessCategoriesService from "../services/subBusinessCategoriesService";

const subBusinessCategoriesSlice = createSharedSlice(
  "subBusinessCategories",
  subBusinessCategoriesService
);

export const fetchSubBusinessCategories =
  subBusinessCategoriesSlice.thunks.fetch;
export const createSubBusinessCategory =
  subBusinessCategoriesSlice.thunks.create;
export const updateSubBusinessCategory =
  subBusinessCategoriesSlice.thunks.update;
export const deleteSubBusinessCategory =
  subBusinessCategoriesSlice.thunks.delete;
export const importSubBusinessCategories =
  subBusinessCategoriesSlice.thunks.importFile;

export default subBusinessCategoriesSlice.reducer;
