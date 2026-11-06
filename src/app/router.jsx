// import {
//   createBrowserRouter,
//   Navigate,
//   Outlet,
// } from "react-router-dom";

// import { useSelector } from "react-redux";

// import LoginPage from "../features/auth/pages/LoginPage";
// import MainLayout from "../layouts/MainLayout";

// import CoreRoutes from "../features/core/coreRoutes";
// import { CreditManagementRoutes } from "../features/credit-management";

// import LoanDashboard from "../features/loan-management/pages/LoanDashboard";
// import CollectionDashboard from "../features/collection/pages/CollectionDashboard";
// import FinanceDashboard from "../features/finance/pages/FinanceDashboard";

// // Protect routes that require authentication
// function RequireAuth() {
//   const isAuthenticated = useSelector(
//     (state) => state.auth.isAuthenticated
//   );

//   return isAuthenticated
//     ? <Outlet />
//     : <Navigate to="/login" replace />;
// }

// // Redirect authenticated users away from login
// function LoginRoute() {
//   const isAuthenticated = useSelector(
//     (state) => state.auth.isAuthenticated
//   );

//   return isAuthenticated
//     ? <Navigate to="/" replace />
//     : <LoginPage />;
// }

// export const router = createBrowserRouter([
//   // Public routes
//   {
//     path: "/login",
//     element: <LoginRoute />,
//   },

//   // Protected routes
//   {
//     element: <RequireAuth />,
//     children: [
//       {
//         path: "/",
//         element: <MainLayout />,
//         children: [
//           // Default dashboard redirect
//           {
//             index: true,
//             element: <Navigate to="/administration" replace />,
//           },

//           // Administration
//           {
//             path: "administration/*",
//             element: <CoreRoutes />,
//           },

//           // Credit Management
//           {
//             path: "credit-management/*",
//             element: <CreditManagementRoutes />,
//           },

//           // Loan Management
//           {
//             path: "loan-management",
//             element: <LoanDashboard />,
//           },

//           // Collection
//           {
//             path: "collection",
//             element: <CollectionDashboard />,
//           },

//           // Finance
//           {
//             path: "finance",
//             element: <FinanceDashboard />,
//           },

//           // Module unavailable page (optional)
//           {
//             path: "module-unavailable",
//             element: (
//               <div style={{ padding: "24px" }}>
//                 <h2>Module Not Available</h2>
//                 <p>
//                   This module is currently unavailable.
//                   Please contact your administrator.
//                 </p>
//               </div>
//             ),
//           },
//         ],
//       },
//     ],
//   },

//   // Unknown routes
//   {
//     path: "*",
//     element: <Navigate to="/" replace />,
//   },
// ]);



import {
  createBrowserRouter,
  Navigate,
  Outlet,
} from "react-router-dom";

import { useSelector } from "react-redux";

import LoginPage from "../features/auth/pages/LoginPage";
import MainLayout from "../layouts/MainLayout";

// Generated customer-specific routes
import { moduleRoutes } from "../features/generated/moduleRoutes";

// Protect authenticated routes
function RequireAuth() {
  const isAuthenticated = useSelector(
    (state) => state.auth.isAuthenticated
  );

  return isAuthenticated
    ? <Outlet />
    : <Navigate to="/login" replace />;
}

// Redirect authenticated users from login
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
            element: (
              <Navigate
                to="/administration"
                replace
              />
            ),
          },

          // Only generated and included modules
          ...moduleRoutes.map(({ path, Component }) => ({
            path,
            element: <Component />,
          })),

          // Shared unavailable page
          {
            path: "module-unavailable",
            element: (
              <div style={{ padding: "24px" }}>
                <h2>Module Not Available</h2>
                <p>
                  This module is currently unavailable.
                  Please contact your administrator.
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
