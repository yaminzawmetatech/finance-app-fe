import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

export default function ModuleRoute({ module }) {
  const activeModules = useSelector(
    (state) => state.company?.activeModules ?? []
  );

  const subscriptionLoaded = useSelector(
    (state) => state.company?.subscriptionLoaded ?? false
  );

  // Avoid denying access while entitlements are loading.
  if (!subscriptionLoaded) {
    return <div>Loading access permissions...</div>;
  }

  if (!activeModules.includes(module)) {
    return <Navigate to="/module-unavailable" replace />;
  }

  return <Outlet />;
}