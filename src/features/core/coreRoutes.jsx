import { Routes, Route } from "react-router-dom";

import AdministrationDashboard from "../administration/pages/AdministrationDashboard";
import UsersList from "./users/pages/UsersList";
import RolesPage from "./roles/pages/RolesPage";
import PositionsPage from "./positions/pages/PositionsPage";
import DepartmentsPage from "./departments/pages/DepartmentsPage";
import TablesPage from "./tables/pages/TablesPage";
import NrcStatePage from "./nrc-states/pages/NrcStatePage";
import NrcTownshipPage from "./nrc-townships/pages/NrcTownshipPage";
import AddressStatesPage from "./address-states/pages/AddressStatesPage";
import AddressDistrictsPage from "./address-districts/pages/AddressDistrictsPage";
import AddressTownshipsPage from "./address-townships/pages/AddressTownshipsPage";
import AddressCitiesPage from "./address-cities/pages/AddressCitiesPage";
import AddressWardsPage from "./address-wards/pages/AddressWardsPage";
import AddressVillagesPage from "./address-villages/pages/AddressVillagesPage";
import AddressVillageTractsPage from "./address-village-tracts/pages/AddressVillageTractsPage";

export default function CoreRoutes() {
    return (
        <Routes>

            <Route index element={<AdministrationDashboard />} />
            
            <Route path= "users" element={<UsersList />} />
            <Route path= "roles" element={<RolesPage />} />

            <Route path= "positions" element={<PositionsPage />} />
            <Route path= "departments" element={<DepartmentsPage />} />

            <Route path= "tables" element={<TablesPage />} />

            <Route path= "nrc-states" element={<NrcStatePage />} />
            <Route path= "nrc-townships" element={<NrcTownshipPage />} />
            <Route path= "address-states" element={<AddressStatesPage />} />
            <Route path= "address-districts" element={<AddressDistrictsPage />} />
            <Route path= "address-townships" element={<AddressTownshipsPage />} />
            <Route path= "address-cities" element={<AddressCitiesPage />} />
            <Route path= "address-wards" element={<AddressWardsPage />} />
            <Route path= "address-villages" element={<AddressVillagesPage />} />
            <Route path= "address-village-tracts" element={<AddressVillageTractsPage />} />
        </Routes>
    );
}