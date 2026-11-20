import createSharedSlice from "../../../../core/shared-slice/store/createSharedSlice";
import typeOfBusinessesService from "../services/typeOfBusinessesService";

const typeOfBusinessesSlice = createSharedSlice(
  "typeOfBusinesses",
  typeOfBusinessesService
);

export const fetchTypeOfBusinesses = typeOfBusinessesSlice.thunks.fetch;
export const createTypeOfBusiness = typeOfBusinessesSlice.thunks.create;
export const updateTypeOfBusiness = typeOfBusinessesSlice.thunks.update;
export const deleteTypeOfBusiness = typeOfBusinessesSlice.thunks.delete;
export const batchDeleteTypeOfBusinesses =
  typeOfBusinessesSlice.thunks.batchDelete;

export default typeOfBusinessesSlice.reducer;
