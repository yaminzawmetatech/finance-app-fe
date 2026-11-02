import { useSelector } from "react-redux";

/**
 * Check whether the current company has an active module entitlement.
 */
export function useModuleAccess() {
  const companyModules = useSelector(
    (state) => state.company?.activeModules ?? []
  );

  const hasModule = (moduleKey) => {
    return companyModules.includes(moduleKey);
  };

  return {
    companyModules,
    hasModule,
  };
}