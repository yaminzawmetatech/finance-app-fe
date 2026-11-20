import createSharedSlice from "../../shared-slice/store/createSharedSlice";
import mainBusinessCategoriesService from "../services/mainBusinessCategoriesService";

const mainBusinessCategoriesSlice = createSharedSlice(
  "mainBusinessCategories",
  mainBusinessCategoriesService
);

export const fetchMainBusinessCategories =
  mainBusinessCategoriesSlice.thunks.fetch;
export const createMainBusinessCategory =
  mainBusinessCategoriesSlice.thunks.create;
export const updateMainBusinessCategory =
  mainBusinessCategoriesSlice.thunks.update;
export const deleteMainBusinessCategory =
  mainBusinessCategoriesSlice.thunks.delete;
export const batchDeleteMainBusinessCategories =
  mainBusinessCategoriesSlice.thunks.batchDelete;
export const importMainBusinessCategories =
  mainBusinessCategoriesSlice.thunks.importFile;

export default mainBusinessCategoriesSlice.reducer;
