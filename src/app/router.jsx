import {
  createBrowserRouter,
  Navigate,
  Outlet,
} from "react-router-dom";

import { useSelector } from "react-redux";

import LoginPage from "../features/auth/pages/LoginPage";
import MainLayout from "../layouts/MainLayout";
import ModuleRoute from "../components/common/ModuleRoute";

import AdministrationDashboard from
  "../features/administration/pages/AdministrationDashboard";

import { CreditManagementRoutes } from "../features/credit-management";

import LoanDashboard from
  "../features/loan-management/pages/LoanDashboard";

import CollectionDashboard from
  "../features/collection/pages/CollectionDashboard";

import FinanceDashboard from
  "../features/finance/pages/FinanceDashboard";
import UsersList from "../features/core/users/pages/UsersList";
import RolesPage from "../features/core/roles/pages/RolesPage";
import PositionsPage from "../features/core/positions/pages/PositionsPage";
import NrcStatePage from "../features/core/nrc-states/pages/NrcStatePage";
import NrcTownshipPage from "../features/core/nrc-townships/pages/NrcTownshipPage";
import DepartmentsPage from "../features/core/departments/pages/DepartmentsPage";

function RequireAuth() {
  const isAuthenticated = useSelector(
    (state) => state.auth.isAuthenticated
  );

  return isAuthenticated
    ? <Outlet />
    : <Navigate to="/login" replace />;
}

function LoginRoute() {
  const isAuthenticated = useSelector(
    (state) => state.auth.isAuthenticated
  );

  return isAuthenticated
    ? <Navigate to="/" replace />
    : <LoginPage />;
}

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginRoute />,
  },

  {
    element: <RequireAuth />,
    children: [
      {
        path: "/",
        element: <MainLayout />,
        children: [
          {
            index: true,
            element: <Navigate to="/administration" replace />,
          },

          {
            element: (
              <ModuleRoute module="administration" />
            ),
            children: [
              {
                path: "administration",
                element: <AdministrationDashboard />,
              },
              {
                path: "/administration/users",
                element: <UsersList />,
              },
              {
                path: "/administration/roles",
                element: <RolesPage />,
              },
              {
                path: "/administration/positions",
                element: <PositionsPage />,
              },
              {
                path: "/administration/departments",
                element: <DepartmentsPage />,
              },
              {
                path: "/administration/nrc-states",
                element: <NrcStatePage />,
              },
              {
                path: "/administration/nrc-townships",
                element: <NrcTownshipPage />,
              },
            ],
          },

          {
            element: (
              <ModuleRoute module="credit-management" />
            ),
            children: [
              {
                path: "credit-management/*",
                element: <CreditManagementRoutes  />,
              },
            ],
          },

          {
            element: (
              <ModuleRoute module="loan-management" />
            ),
            children: [
              {
                path: "loan-management",
                element: <LoanDashboard />,
              },
            ],
          },

          {
            element: (
              <ModuleRoute module="collection" />
            ),
            children: [
              {
                path: "collection",
                element: <CollectionDashboard />,
              },
            ],
          },

          {
            element: (
              <ModuleRoute module="finance" />
            ),
            children: [
              {
                path: "finance",
                element: <FinanceDashboard />,
              },
            ],
          },

          {
            path: "module-unavailable",
            element: (
              <div>
                <h2>Module Not Available</h2>
                <p>
                  Your company has not purchased this module.
                </p>
              </div>
            ),
          },
        ],
      },
    ],
  },

  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);