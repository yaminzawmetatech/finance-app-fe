import { useSelector } from "react-redux";

export const usePermission = () => {
  const permissions = useSelector(
    (state) => state.auth.user.permissions || []
  );

  const can = (permission) =>
    permissions.includes(permission);

  const canAny = (requiredPermissions = []) =>
    requiredPermissions.some((permission) =>
      permissions.includes(permission)
    );

  const canAll = (requiredPermissions = []) =>
    requiredPermissions.every((permission) =>
      permissions.includes(permission)
    );

  return {
    permissions,
    can,
    canAny,
    canAll,
  };
};