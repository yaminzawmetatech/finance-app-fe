export const filterNavigation = (
  navigation,
  enabledModules
) => {
  return navigation
    .map((item) => {
      // Core items are always available.
      if (item.type === "core" || item.type === "module") {
        if (
          item.module &&
          !enabledModules.includes(item.module)
        ) {
          return null;
        }

        return item;
      }

      // Filter nested menus.
      if (item.children) {
        const children = item.children
          .map((child) => {
            if (
              child.module &&
              !enabledModules.includes(child.module)
            ) {
              return null;
            }

            if (child.children) {
              const nestedChildren = child.children.filter(
                (nested) => !nested.module ||
                  enabledModules.includes(nested.module)
              );

              return nestedChildren.length
                ? { ...child, children: nestedChildren }
                : null;
            }

            return child;
          })
          .filter(Boolean);

        return children.length
          ? { ...item, children }
          : null;
      }

      return item;
    })
    .filter(Boolean);
};