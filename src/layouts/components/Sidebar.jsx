
// import { useState } from "react";
// import {
//   Box,
//   Drawer,
//   List,
//   ListItemButton,
//   ListItemIcon,
//   ListItemText,
//   Collapse,
//   Typography,
//   Divider,
// } from "@mui/material";

// import {
//   Settings,
//   Users,
//   Building2,
//   ShieldCheck,
//   LockKeyhole,
//   Network,
//   Wallet,
//   HandCoins,
//   Calculator,
//   ChevronDown,
//   ChevronRight,
// } from "lucide-react";

// import { NavLink, useLocation } from "react-router-dom";

// import { NAVIGATION_CONFIG } from "../../config/navigationConfig";
// import { useSelector } from "react-redux";

// const DRAWER_WIDTH = 260;

// const ICONS = {
//   Settings,
//   Users,
//   Building2,
//   ShieldCheck,
//   LockKeyhole,
//   Network,
//   Wallet,
//   HandCoins,
//   Calculator,
// };

// export default function Sidebar() {
//   const location = useLocation();


//   const { activeModules = [], subscriptionLoaded } = useSelector(
//     (state) => state.company || {}
//   );

//   const [openMenus, setOpenMenus] = useState({
//     administration: true,
//   });

//   // Filter navigation based on purchased/build modules
//   const navigation = !subscriptionLoaded
//     ? []
//     : NAVIGATION_CONFIG
//       .filter((item) => activeModules.includes(item.module))
//       .map((item) => {
//         if (item.type === "group") {
//           return {
//             ...item,
//             children: item.children.filter((child) =>
//               activeModules.includes(child.module)
//             ),
//           };
//         }

//         return item;
//       })
//       .filter((item) =>
//         item.type !== "group" || item.children.length > 0
//       );

//   const toggleMenu = (id) => {
//     setOpenMenus((prev) => ({
//       ...prev,
//       [id]: !prev[id],
//     }));
//   };

//   const isActive = (path) => location.pathname === path;

//   const renderIcon = (iconName) => {
//     const Icon = ICONS[iconName];

//     return Icon ? <Icon size={19} /> : null;
//   };

//   return (
//     <Drawer
//       variant="permanent"
//       sx={{
//         width: DRAWER_WIDTH,
//         flexShrink: 0,
//         "& .MuiDrawer-paper": {
//           width: DRAWER_WIDTH,
//           boxSizing: "border-box",
//           bgcolor: "#172033",
//           color: "#FFFFFF",
//           borderRight: "none",
//           height: "100vh",
//         },
//       }}
//     >
//       {/* Logo */}
//       <Box sx={{ px: 3, py: 3 }}>
//         <Typography variant="h6" fontWeight={800}>
//           MICROFINANCE
//         </Typography>

//         <Typography
//           variant="caption"
//           sx={{ color: "#98A2B3" }}
//         >
//           Management System
//         </Typography>
//       </Box>

//       <Divider sx={{ borderColor: "#344054" }} />

//       {/* Navigation */}
//       <List sx={{ px: 1.5, py: 2 }}>
//         {navigation.map((item) => {
//           const isGroup = item.type === "group";

//           if (isGroup) {
//             const expanded = openMenus[item.id];

//             const groupActive = item.children.some(
//               (child) => isActive(child.path)
//             );

//             return (
//               <Box key={item.id} sx={{ mb: 1 }}>
//                 <ListItemButton
//                   onClick={() => toggleMenu(item.id)}
//                   sx={{
//                     borderRadius: 1.5,
//                     color: groupActive ? "#F07E2C" : "#D0D5DD",
//                     mb: 0.5,
//                     "&:hover": {
//                       bgcolor: "#263247",
//                     },
//                   }}
//                 >
//                   <ListItemIcon
//                     sx={{
//                       color: "inherit",
//                       minWidth: 38,
//                     }}
//                   >
//                     {renderIcon(item.icon)}
//                   </ListItemIcon>

//                   <ListItemText
//                     primary={item.label}
//                     primaryTypographyProps={{
//                       fontSize: 14,
//                       fontWeight: 600,
//                     }}
//                   />

//                   {expanded ? (
//                     <ChevronDown size={17} />
//                   ) : (
//                     <ChevronRight size={17} />
//                   )}
//                 </ListItemButton>

//                 <Collapse
//                   in={expanded}
//                   timeout="auto"
//                   unmountOnExit
//                 >
//                   <List disablePadding>
//                     {item.children.map((child) => (
//                       <ListItemButton
//                         key={child.id}
//                         component={NavLink}
//                         to={child.path}
//                         sx={{
//                           pl: 4.5,
//                           py: 1.2,
//                           mb: 0.5,
//                           borderRadius: 1.5,
//                           color: isActive(child.path)
//                             ? "#FFFFFF"
//                             : "#98A2B3",
//                           bgcolor: isActive(child.path)
//                             ? "#F07E2C"
//                             : "transparent",
//                           "&:hover": {
//                             bgcolor: isActive(child.path)
//                               ? "#E56D1D"
//                               : "#263247",
//                             color: "#FFFFFF",
//                           },
//                         }}
//                       >
//                         <ListItemIcon
//                           sx={{
//                             color: "inherit",
//                             minWidth: 32,
//                           }}
//                         >
//                           {renderIcon(child.icon)}
//                         </ListItemIcon>

//                         <ListItemText
//                           primary={child.label}
//                           primaryTypographyProps={{
//                             fontSize: 13,
//                             fontWeight: isActive(child.path)
//                               ? 600
//                               : 400,
//                           }}
//                         />
//                       </ListItemButton>
//                     ))}
//                   </List>
//                 </Collapse>
//               </Box>
//             );
//           }

//           return (
//             <ListItemButton
//               key={item.id}
//               component={NavLink}
//               to={item.path}
//               sx={{
//                 borderRadius: 1.5,
//                 mb: 0.5,
//                 color: isActive(item.path)
//                   ? "#FFFFFF"
//                   : "#D0D5DD",
//                 bgcolor: isActive(item.path)
//                   ? "#F07E2C"
//                   : "transparent",
//                 "&:hover": {
//                   bgcolor: isActive(item.path)
//                     ? "#E56D1D"
//                     : "#263247",
//                 },
//               }}
//             >
//               <ListItemIcon
//                 sx={{
//                   color: "inherit",
//                   minWidth: 38,
//                 }}
//               >
//                 {renderIcon(item.icon)}
//               </ListItemIcon>

//               <ListItemText
//                 primary={item.label}
//                 primaryTypographyProps={{
//                   fontSize: 14,
//                   fontWeight: 600,
//                 }}
//               />
//             </ListItemButton>
//           );
//         })}
//       </List>

//       <Box sx={{ mt: "auto", px: 3, py: 2 }}>
//         <Typography
//           variant="caption"
//           sx={{ color: "#667085" }}
//         >
//           Microfinance Management System
//         </Typography>
//       </Box>
//     </Drawer>
//   );
// }

// export { DRAWER_WIDTH };
import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Typography,
  Divider,
} from "@mui/material";

import {
  Settings,
  Users,
  Building2,
  ShieldCheck,
  LockKeyhole,
  Network,
  Wallet,
  HandCoins,
  Calculator,
  ChevronDown,
  ChevronRight,
  LayoutDashboard,
  UserRound,
  Tags,
  BriefcaseBusiness,
  Map,
  MapPinned,
  FileText,
  ClipboardCheck,
  Package,
  ClipboardList,
  BookOpen,
  NotebookPen,
} from "lucide-react";

import { NavLink, useLocation } from "react-router-dom";

// import { NAVIGATION_CONFIG } from "../../config/navigationConfig";
import { NAVIGATION_CONFIG } from "../../config/navigation";

import { usePermission } from "../../hooks/usePermission";


const DRAWER_WIDTH = 260;

export const THEME = {
  bgSidebar: "#FFFBF7",
  bgContent: "#F7F5F2",
  bgCard: "#FFFFFF",

  primary: "#F07E2C",
  accentText: "#E86F1C",

  bgActive: "#FFF0E5",
  bgActiveHover: "#FFE7D5",
  bgHover: "#F7F2ED",

  textPrimary: "#343434",
  textMuted: "#77716C",
  textLight: "#A39A92",

  border: "#EEE7E0",

  activeShadow: "inset 3px 0 0 #F07E2C",
};

const ICONS = {
  Settings,
  Users,
  Building2,
  ShieldCheck,
  LockKeyhole,
  Network,
  Wallet,
  HandCoins,
  Calculator,
  LayoutDashboard,
  UserRound,
  Tags,
  BriefcaseBusiness,
  Map,
  MapPinned,
  FileText,
  ClipboardCheck,
  Package,
  ClipboardList,
  BookOpen,
  NotebookPen,
};

export default function Sidebar() {
  const location = useLocation();

  const { permissions } = usePermission();


  const isActive = (path) => {
    if (!path) return false;

    return (
      location.pathname === path ||
      (path !== "/" && location.pathname.startsWith(`${path}/`))
    );
  };

  // Filter purchased modules
  // const navigation = useMemo(() => {
  //   if (!subscriptionLoaded) return [];

  //   return NAVIGATION_CONFIG
  //     .filter((item) => {
  //       if (item.type === "core") return true;

  //       return !item.module || activeModules.includes(item.module);
  //     })
  //     .map((item) => {
  //       if (!item.children) return item;

  //       const children = item.children.filter(
  //         (child) =>
  //           !child.module || activeModules.includes(child.module)
  //       );

  //       return {
  //         ...item,
  //         children,
  //       };
  //     })
  //     .filter(
  //       (item) => !item.children || item.children.length > 0
  //     );
  // }, [activeModules, subscriptionLoaded]);


  const navigation = useMemo(() => {
    const filterItems = (items) =>
      items
        .map((item) => {
          if (!item.children) return item;

          return {
            ...item,
            children: filterItems(item.children),
          };
        })
        .filter((item) => {
          if (item.children) {
            return item.children.length > 0;
          }

          return (
            !item.permission ||
            permissions.includes(item.permission)
          );
        });

    return filterItems(NAVIGATION_CONFIG);
  }, [permissions]);

  const [openMenus, setOpenMenus] = useState({
    administration: true,
  });

  // Automatically expand the active module
  useEffect(() => {
    const activeGroup = navigation.find(
      (item) =>
        item.type === "group" &&
        item.children?.some((child) => isActive(child.path))
    );

    if (activeGroup) {
      setOpenMenus((prev) => ({
        ...prev,
        [activeGroup.id]: true,
      }));
    }
  }, [location.pathname, navigation]);

  const toggleMenu = (id) => {
    setOpenMenus((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const renderIcon = (iconName, size = 19) => {
    const Icon = ICONS[iconName];

    return Icon ? (
      <Icon size={size} strokeWidth={1.8} />
    ) : null;
  };

  // Common navigation style
  const navigationItemStyle = (active = false) => ({
    borderRadius: "9px",
    mb: 0.6,
    minHeight: 42,
    px: 1.5,

    color: active ? THEME.accentText : THEME.textMuted,

    bgcolor: active ? THEME.bgActive : "transparent",

    boxShadow: active ? THEME.activeShadow : "none",

    transition: "background-color 0.2s ease, color 0.2s ease",

    "&:hover": {
      bgcolor: active
        ? THEME.bgActiveHover
        : THEME.bgHover,
      color: active
        ? THEME.accentText
        : THEME.textPrimary,
    },

    "& .MuiListItemIcon-root": {
      color: "inherit",
    },

    "& .MuiListItemText-primary": {
      fontSize: "13.5px",
      fontWeight: active ? 650 : 500,
      letterSpacing: "0.05px",
    },
  });

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,

        "& .MuiDrawer-paper": {
          width: DRAWER_WIDTH,
          boxSizing: "border-box",
          bgcolor: THEME.bgSidebar,
          color: THEME.textPrimary,
          borderRight: `1px solid ${THEME.border}`,
          height: "100vh",
          overflowX: "hidden",
          overflowY: "auto",
        },
      }}
    >
      {/* Brand */}
      <Box sx={{ px: 2.8, py: 2.7 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.4,
          }}
        >
          <Box
            sx={{
              width: 5,
              height: 29,
              borderRadius: 5,
              bgcolor: THEME.primary,
              boxShadow: "0 2px 6px rgba(240,126,44,0.25)",
            }}
          />

          <Typography
            sx={{
              fontSize: 17,
              fontWeight: 800,
              letterSpacing: "0.5px",
              color: THEME.textPrimary,
            }}
          >
            MICROFINANCE
          </Typography>
        </Box>

        <Typography
          sx={{
            mt: 0.5,
            pl: 2,
            fontSize: 11,
            fontWeight: 500,
            letterSpacing: "0.25px",
            color: THEME.textLight,
          }}
        >
          MANAGEMENT SYSTEM
        </Typography>
      </Box>

      <Divider sx={{ borderColor: THEME.border }} />

      {/* Navigation */}
      <Box sx={{ px: 1.5, py: 2.2 }}>
        <Typography
          sx={{
            px: 1.5,
            mb: 1.3,
            fontSize: 10,
            fontWeight: 700,
            color: THEME.textLight,
            letterSpacing: "1.1px",
          }}
        >
          MAIN MENU
        </Typography>

        <List disablePadding>
          {navigation.map((item) => {
            const isGroup = item.type === "group";

            if (isGroup) {
              const expanded = !!openMenus[item.id];

              const groupActive = item.children?.some(
                (child) => isActive(child.path)
              );

              return (
                <Box key={item.id} sx={{ mb: 0.8 }}>
                  {/* Parent Menu */}
                  <ListItemButton
                    onClick={() => toggleMenu(item.id)}
                    sx={{
                      ...navigationItemStyle(groupActive),
                      bgcolor: groupActive
                        ? THEME.bgActive
                        : "transparent",
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 36,
                      }}
                    >
                      {renderIcon(item.icon, 19)}
                    </ListItemIcon>

                    <ListItemText
                      primary={item.label}
                      primaryTypographyProps={{
                        fontSize: 13.5,
                        fontWeight: groupActive ? 650 : 550,
                      }}
                    />

                    {expanded ? (
                      <ChevronDown
                        size={16}
                        color={THEME.textMuted}
                      />
                    ) : (
                      <ChevronRight
                        size={16}
                        color={THEME.textMuted}
                      />
                    )}
                  </ListItemButton>

                  {/* Submenus */}
                  <Collapse
                    in={expanded}
                    timeout={200}
                    unmountOnExit
                  >
                    <List
                      disablePadding
                      sx={{
                        ml: 2.3,
                        mt: 0.5,
                        pl: 1.2,
                        borderLeft: `1px solid ${THEME.border}`,
                      }}
                    >
                      {item.children.map((child) => {
                        const active = isActive(child.path);

                        return (
                          <ListItemButton
                            key={child.id}
                            component={NavLink}
                            to={child.path}
                            sx={{
                              ...navigationItemStyle(active),
                              pl: 1.5,
                              pr: 1,
                              minHeight: 36,
                              borderRadius: "7px",
                              mb: 0.3,

                              "& .MuiListItemText-primary": {
                                fontSize: 12.5,
                                fontWeight: active ? 650 : 450,
                              },
                            }}
                          >
                            <ListItemIcon
                              sx={{
                                minWidth: 29,
                              }}
                            >
                              {renderIcon(child.icon, 16)}
                            </ListItemIcon>

                            <ListItemText
                              primary={child.label}
                            />
                          </ListItemButton>
                        );
                      })}
                    </List>
                  </Collapse>
                </Box>
              );
            }

            // Standalone menu
            const active = isActive(item.path);

            return (
              <ListItemButton
                key={item.id}
                component={NavLink}
                to={item.path}
                sx={navigationItemStyle(active)}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>
                  {renderIcon(item.icon, 19)}
                </ListItemIcon>

                <ListItemText primary={item.label} />
              </ListItemButton>
            );
          })}
        </List>
      </Box>

      {/* Footer */}
      <Box
        sx={{
          mt: "auto",
          px: 2.8,
          py: 2,
          borderTop: `1px solid ${THEME.border}`,
        }}
      >
        <Typography
          sx={{
            fontSize: 10.5,
            fontWeight: 500,
            color: THEME.textLight,
            letterSpacing: "0.2px",
          }}
        >
          VERSION 1.0.0
        </Typography>
      </Box>
    </Drawer>
  );
}

export { DRAWER_WIDTH };