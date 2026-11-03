
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

import { NAVIGATION_CONFIG } from "../../config/navigationConfig";
import { useSelector } from "react-redux";

const DRAWER_WIDTH = 260;

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
      .filter((item) =>
        item.type !== "group" || item.children.length > 0
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

    return Icon ? <Icon size={19} /> : null;
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: DRAWER_WIDTH,
          boxSizing: "border-box",
          bgcolor: "#172033",
          color: "#FFFFFF",
          borderRight: "none",
          height: "100vh",
        },
      }}
    >
      {/* Logo */}
      <Box sx={{ px: 3, py: 3 }}>
        <Typography variant="h6" fontWeight={800}>
          MICROFINANCE
        </Typography>

        <Typography
          variant="caption"
          sx={{ color: "#98A2B3" }}
        >
          Management System
        </Typography>
      </Box>

      <Divider sx={{ borderColor: "#344054" }} />

      {/* Navigation */}
      <List sx={{ px: 1.5, py: 2 }}>
        {navigation.map((item) => {
          const isGroup = item.type === "group";

          if (isGroup) {
            const expanded = openMenus[item.id];

            const groupActive = item.children.some(
              (child) => isActive(child.path)
            );

            return (
              <Box key={item.id} sx={{ mb: 1 }}>
                <ListItemButton
                  onClick={() => toggleMenu(item.id)}
                  sx={{
                    borderRadius: 1.5,
                    color: groupActive ? "#F07E2C" : "#D0D5DD",
                    mb: 0.5,
                    "&:hover": {
                      bgcolor: "#263247",
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: "inherit",
                      minWidth: 38,
                    }}
                  >
                    {renderIcon(item.icon)}
                  </ListItemIcon>

                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontSize: 14,
                      fontWeight: 600,
                    }}
                  />

                  {expanded ? (
                    <ChevronDown size={17} />
                  ) : (
                    <ChevronRight size={17} />
                  )}
                </ListItemButton>

                <Collapse
                  in={expanded}
                  timeout="auto"
                  unmountOnExit
                >
                  <List disablePadding>
                    {item.children.map((child) => (
                      <ListItemButton
                        key={child.id}
                        component={NavLink}
                        to={child.path}
                        sx={{
                          pl: 4.5,
                          py: 1.2,
                          mb: 0.5,
                          borderRadius: 1.5,
                          color: isActive(child.path)
                            ? "#FFFFFF"
                            : "#98A2B3",
                          bgcolor: isActive(child.path)
                            ? "#F07E2C"
                            : "transparent",
                          "&:hover": {
                            bgcolor: isActive(child.path)
                              ? "#E56D1D"
                              : "#263247",
                            color: "#FFFFFF",
                          },
                        }}
                      >
                        <ListItemIcon
                          sx={{
                            color: "inherit",
                            minWidth: 32,
                          }}
                        >
                          {renderIcon(child.icon)}
                        </ListItemIcon>

                        <ListItemText
                          primary={child.label}
                          primaryTypographyProps={{
                            fontSize: 13,
                            fontWeight: isActive(child.path)
                              ? 600
                              : 400,
                          }}
                        />
                      </ListItemButton>
                    ))}
                  </List>
                </Collapse>
              </Box>
            );
          }

          return (
            <ListItemButton
              key={item.id}
              component={NavLink}
              to={item.path}
              sx={{
                borderRadius: 1.5,
                mb: 0.5,
                color: isActive(item.path)
                  ? "#FFFFFF"
                  : "#D0D5DD",
                bgcolor: isActive(item.path)
                  ? "#F07E2C"
                  : "transparent",
                "&:hover": {
                  bgcolor: isActive(item.path)
                    ? "#E56D1D"
                    : "#263247",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: "inherit",
                  minWidth: 38,
                }}
              >
                {renderIcon(item.icon)}
              </ListItemIcon>

              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontSize: 14,
                  fontWeight: 600,
                }}
              />
            </ListItemButton>
          );
        })}
      </List>

      <Box sx={{ mt: "auto", px: 3, py: 2 }}>
        <Typography
          variant="caption"
          sx={{ color: "#667085" }}
        >
          Microfinance Management System
        </Typography>
      </Box>
    </Drawer>
  );
}

export { DRAWER_WIDTH };