import createSharedSlice from "../../shared-slice/store/createSharedSlice";
import categoriesService from "../services/categoriesService";

const categoriesSlice = createSharedSlice(
  "categories",
  categoriesService
);

export const fetchCategories = categoriesSlice.thunks.fetch;
export const createCategory = categoriesSlice.thunks.create;
export const updateCategory = categoriesSlice.thunks.update;
export const deleteCategory = categoriesSlice.thunks.delete;

export default categoriesSlice.reducer;
