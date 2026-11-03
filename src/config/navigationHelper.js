export const filterNavigation = (navigation, enabledModules = []) => {
  return navigation
    .filter((item) => {
      // Core navigation is always available.
      if (item.type === "core") return true;

      // Remove modules that the company has not purchased.
      if (item.module && !enabledModules.includes(item.module)) {
        return false;
      }

      return true;
    })
    .map((item) => {
      // Filter child menus.
      if (!item.children) return item;

      const children = item.children.filter((child) => {
        if (!child.module) return true;

        return enabledModules.includes(child.module);
      });

      // Remove parent if no child menus remain.
      if (children.length === 0) return null;

      return {
        ...item,
        children,
      };
    })
    .filter(Boolean);
};