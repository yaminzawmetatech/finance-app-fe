import { Routes, Route } from "react-router-dom";

// Setup pages
import OccupationsList from "../setups/occupations/pages/OccupationsList";
import DocumentTypesList from "../setups/document-types/pages/DocumentTypesList";

// Application pages
import ApplicationsList from "../applications/pages/ApplicationsList";
import CreateApplication from "../applications/pages/CreateApplication";

// Report pages
import ApplicationReport from "../reports/pages/ApplicationReport";

import CreditDashboard from "../dashboard/pages/CreditDashboard";
import AssessmentList from "../assessments/pages/AssessmentList";

export default function CreditManagementRoutes() {
    return (
        <Routes>

            <Route index element={<CreditDashboard />} />
            
            {/* Setups */}
            <Route path="setups/occupations" element={<OccupationsList />} />
            <Route path="setups/document-types" element={<DocumentTypesList />} />

            {/* Applications */}
            <Route path="applications" element={<ApplicationsList />} />
            <Route path="applications/create" element={<CreateApplication />} />

            {/* Assessments */}
            <Route path="assessments" element={<AssessmentList />} />

            {/* Reports */}
            <Route path="reports/applications" element={<ApplicationReport />} />
        </Routes>
    );
}