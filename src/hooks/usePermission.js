
import { useSelector } from "react-redux";

const EMPTY_PERMISSIONS = [];

export const usePermission = () => {
  const permissions = useSelector(
    (state) =>
      state.auth.user?.permissions ?? EMPTY_PERMISSIONS
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
