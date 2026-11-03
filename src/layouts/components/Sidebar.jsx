
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

import { useState } from "react";

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
} from "lucide-react";

import { NavLink, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

import { NAVIGATION_CONFIG } from "../../config/navigationConfig";

const DRAWER_WIDTH = 260;

// Soft Grey + Light Orange Theme
const THEME = {
  // Backgrounds
  bgSidebar: "#FCFCFD",
  bgHover: "#F4F5F6",
  bgActive: "#FFF1E8",
  bgActiveHover: "#FFE7D8",

  // Borders
  border: "#EAECF0",

  // Orange
  primary: "#F59350",
  primaryDark: "#E8874A",
  accentText: "#D9793B",

  // Typography
  textPrimary: "#343A40",
  textMuted: "#858B93",
  textLight: "#A0A5AB",

  // Shadows
  activeShadow: "0 2px 6px rgba(245, 147, 80, 0.10)",
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
};

export default function Sidebar() {
  const location = useLocation();

  const { activeModules = [], subscriptionLoaded } = useSelector(
    (state) => state.company || {}
  );

  const [openMenus, setOpenMenus] = useState({
    administration: true,
  });

  // Filter navigation based on purchased/build modules
  const navigation = !subscriptionLoaded
    ? []
    : NAVIGATION_CONFIG
        .filter((item) => activeModules.includes(item.module))
        .map((item) => {
          if (item.type === "group") {
            return {
              ...item,
              children: item.children.filter((child) =>
                activeModules.includes(child.module)
              ),
            };
          }

          return item;
        })
        .filter(
          (item) => item.type !== "group" || item.children.length > 0
        );

  const toggleMenu = (id) => {
    setOpenMenus((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const isActive = (path) => location.pathname === path;

  const renderIcon = (iconName) => {
    const Icon = ICONS[iconName];

    return Icon ? <Icon size={19} strokeWidth={1.8} /> : null;
  };

  // Common navigation styling
  const navigationItemStyle = (active = false) => ({
    borderRadius: 1.5,
    mb: 0.5,
    minHeight: 42,

    color: active ? THEME.accentText : THEME.textMuted,

    bgcolor: active ? THEME.bgActive : "transparent",

    boxShadow: active ? THEME.activeShadow : "none",

    transition: "all 0.2s ease",

    "&:hover": {
      bgcolor: active ? THEME.bgActiveHover : THEME.bgHover,
      color: active ? THEME.accentText : THEME.textPrimary,
    },

    "& .MuiListItemIcon-root": {
      color: "inherit",
    },

    "& .MuiListItemText-primary": {
      fontWeight: active ? 600 : 400,
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
        },
      }}
    >
      {/* Brand Header */}
      <Box sx={{ px: 3, py: 2.5 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            mb: 0.5,
          }}
        >
          <Box
            sx={{
              width: 7,
              height: 25,
              borderRadius: 2,
              bgcolor: THEME.primary,
            }}
          />

          <Typography
            variant="h6"
            sx={{
              fontWeight: 800,
              fontSize: 18,
              letterSpacing: "0.04em",
              color: THEME.textPrimary,
            }}
          >
            MICROFINANCE
          </Typography>
        </Box>

        <Typography
          variant="caption"
          sx={{
            color: THEME.textMuted,
            pl: 2.5,
            display: "block",
            fontSize: 11,
          }}
        >
          Management System
        </Typography>
      </Box>

      <Divider sx={{ borderColor: THEME.border }} />

      {/* Navigation */}
      <List sx={{ px: 1.5, py: 2 }}>
        {navigation.map((item) => {
          const isGroup = item.type === "group";

          if (isGroup) {
            const expanded = openMenus[item.id];

            const groupActive = item.children.some((child) =>
              isActive(child.path)
            );

            return (
              <Box key={item.id} sx={{ mb: 0.8 }}>
                {/* Parent Menu */}
                <ListItemButton
                  onClick={() => toggleMenu(item.id)}
                  sx={{
                    ...navigationItemStyle(groupActive),
                    bgcolor: groupActive
                      ? "#FFF7F1"
                      : "transparent",
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 36,
                    }}
                  >
                    {renderIcon(item.icon)}
                  </ListItemIcon>

                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontSize: 14,
                      fontWeight: groupActive ? 600 : 500,
                    }}
                  />

                  {expanded ? (
                    <ChevronDown
                      size={17}
                      color={THEME.textMuted}
                    />
                  ) : (
                    <ChevronRight
                      size={17}
                      color={THEME.textMuted}
                    />
                  )}
                </ListItemButton>

                {/* Submenus */}
                <Collapse
                  in={expanded}
                  timeout="auto"
                  unmountOnExit
                >
                  <List
                    disablePadding
                    sx={{
                      ml: 2,
                      pl: 1,
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
                            pl: 2,
                            py: 1,
                            minHeight: 38,
                            borderRadius: 1.5,
                          }}
                        >
                          <ListItemIcon
                            sx={{
                              minWidth: 30,
                            }}
                          >
                            {renderIcon(child.icon)}
                          </ListItemIcon>

                          <ListItemText
                            primary={child.label}
                            primaryTypographyProps={{
                              fontSize: 13,
                              fontWeight: active ? 600 : 400,
                            }}
                          />
                        </ListItemButton>
                      );
                    })}
                  </List>
                </Collapse>
              </Box>
            );
          }

          // Standalone Menu
          const active = isActive(item.path);

          return (
            <ListItemButton
              key={item.id}
              component={NavLink}
              to={item.path}
              sx={{
                ...navigationItemStyle(active),
                minHeight: 42,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 36,
                }}
              >
                {renderIcon(item.icon)}
              </ListItemIcon>

              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontSize: 14,
                  fontWeight: active ? 600 : 500,
                }}
              />
            </ListItemButton>
          );
        })}
      </List>

      {/* Footer */}
      <Box
        sx={{
          mt: "auto",
          px: 3,
          py: 2.5,
          borderTop: `1px solid ${THEME.border}`,
        }}
      >
        <Typography
          variant="caption"
          sx={{
            color: THEME.textLight,
            fontWeight: 500,
            fontSize: 11,
          }}
        >
          v1.0.0 • Microfinance System
        </Typography>
      </Box>
    </Drawer>
  );
}

export { DRAWER_WIDTH };