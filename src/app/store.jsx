
import { configureStore } from "@reduxjs/toolkit";

import auth from "../features/auth/slices/authSlice";
import company from "../features/subscriptions/slices/companySlice";
import users from "../features/core/users/store/usersSlice";
import nrcStates from "../features/core/nrc-states/store/nrcStatesSlice";
import nrcTownships from "../features/core/nrc-townships/store/nrcTownshipsSlice";
import positions from "../features/core/positions/store/positionsSlice";
import roles from "../features/core/roles/store/rolesSlice";
import tables from "../features/core/tables/store/tablesSlice";
import addressStates from "../features/core/address-states/store/addressStatesSlice";
import addressDistricts from "../features/core/address-districts/store/addressDistrictsSlice";
import addressTownships from "../features/core/address-townships/store/addressTownshipsSlice";
import addressCities from "../features/core/address-cities/store/addressCitiesSlice";
import addressWards from "../features/core/address-wards/store/addressWardsSlice";
import addressVillages from "../features/core/address-villages/store/addressVillagesSlice";
import addressVillageTracts from "../features/core/address-village-tracts/store/addressVillageTractsSlice";
import categories from "../features/core/categories/store/categoriesSlice";
import subCategories from "../features/core/sub-categories/store/subCategoriesSlice";


export const store = configureStore({
  reducer: {
    auth,
    company,
    users,
    nrcStates,
    nrcTownships,
    positions,
    roles,
    tables,
    addressStates,
    addressDistricts,
    addressTownships,
    addressCities,
    addressWards,
    addressVillages,
    addressVillageTracts,
    categories,
    subCategories,
  },
});
