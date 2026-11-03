import {
  Box,
  Collapse,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Tooltip,
} from "@mui/material";
import {
  Building2,
  Calculator,
  ChevronDown,
  ChevronRight,
  HandCoins,
  LockKeyhole,
  Settings,
  Sparkles,
  ShieldCheck,
  Users,
  Wallet,
} from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { NavLink, useLocation } from "react-router-dom";
import { NAVIGATION_CONFIG } from "../../config/navigationConfig";

const DRAWER_WIDTH = 264;

const ICONS = {
  Settings,
  Users,
  Building2,
  ShieldCheck,
  LockKeyhole,
  Wallet,
  HandCoins,
  Calculator,
  Sparkles,
};

export default function Sidebar({
  isMobile = false,
  collapsed = false,
  mobileOpen = false,
  width = DRAWER_WIDTH,
  onClose,
}) {
  const location = useLocation();
  const { activeModules = [], activeCompany, subscriptionLoaded } = useSelector(
    (state) => state.company || {}
  );
  const [openMenus, setOpenMenus] = useState({});

  const navigation = !subscriptionLoaded
    ? []
    : NAVIGATION_CONFIG
        .filter((item) => activeModules.includes(item.module))
        .map((item) =>
          item.type === "group"
            ? {
                ...item,
                children: item.children.filter((child) =>
                  activeModules.includes(child.module)
                ),
              }
            : item
        )
        .filter((item) => item.type !== "group" || item.children.length > 0);

  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(`${path}/`);
  const renderIcon = (iconName, size = 18) => {
    const Icon = ICONS[iconName];
    return Icon ? <Icon size={size} strokeWidth={1.8} /> : null;
  };

  const drawerContent = (
    <Box className={`app-sidebar-content${collapsed ? " is-collapsed" : ""}`}>
      <Box className="app-sidebar-brand">
        <span className="app-sidebar-brand-mark" aria-hidden="true" />
        <Box className="app-sidebar-brand-copy">
          <Typography component="span">MICROFINANCE</Typography>
          <Typography className="app-sidebar-brand-caption">
            Management System
          </Typography>
        </Box>
      </Box>

      <Divider className="app-sidebar-divider" />

      <Typography className="app-sidebar-section-label">
        MENU
      </Typography>

      <List className="app-sidebar-navigation">
        {navigation.map((item) => {
          if (item.type === "group") {
            const expanded = openMenus[item.id] ?? true;
            const groupActive =
              item.children.some((child) => isActive(child.path)) ||
              (item.id === "administration" &&
                location.pathname === "/administration");

            return (
              <Box
                className={`app-sidebar-group${expanded ? " is-expanded" : ""}`}
                key={item.id}
              >
                <Tooltip title={collapsed ? item.label : ""} placement="right">
                  <ListItemButton
                    className={`app-sidebar-item app-sidebar-group-trigger${groupActive ? " is-active" : ""}`}
                    onClick={() =>
                      setOpenMenus((previous) => ({
                        ...previous,
                        [item.id]: !expanded,
                      }))
                    }
                    aria-expanded={expanded}
                    aria-label={collapsed ? item.label : undefined}
                  >
                    <ListItemIcon className="app-sidebar-icon">
                      {renderIcon(item.icon)}
                    </ListItemIcon>
                    <ListItemText primary={item.label} />
                    {!collapsed && (expanded ? (
                      <ChevronDown size={16} />
                    ) : (
                      <ChevronRight size={16} />
                    ))}
                  </ListItemButton>
                </Tooltip>

                <Collapse in={expanded} timeout="auto" unmountOnExit={!collapsed}>
                  <List className="app-sidebar-subnavigation" disablePadding>
                    {item.children.map((child) => {
                      const active = isActive(child.path);
                      return (
                        <ListItemButton
                          key={child.id}
                          component={NavLink}
                          to={child.path}
                          onClick={onClose}
                          className={`app-sidebar-subitem${active ? " is-active is-current" : ""}`}
                          aria-current={active ? "page" : undefined}
                        >
                          <ListItemIcon className="app-sidebar-icon">
                            {renderIcon(child.icon, 16)}
                          </ListItemIcon>
                          <ListItemText primary={child.label} />
                        </ListItemButton>
                      );
                    })}
                  </List>
                </Collapse>
              </Box>
            );
          }

          const active = isActive(item.path);
          return (
            <Tooltip key={item.id} title={collapsed ? item.label : ""} placement="right">
            <ListItemButton
              component={NavLink}
              to={item.path}
              onClick={onClose}
              className={`app-sidebar-item${active ? " is-active is-current" : ""}`}
              aria-current={active ? "page" : undefined}
              aria-label={collapsed ? item.label : undefined}
            >
              <ListItemIcon className="app-sidebar-icon">
                {renderIcon(item.icon)}
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
            </Tooltip>
          );
        })}
      </List>

      <Box className="app-sidebar-bottom">
        {!collapsed && (
          <Box className="app-sidebar-promo">
            <Sparkles className="app-sidebar-promo-spark" size={18} />
            <Typography>Finance, made clearer.</Typography>
            <span>Everything your team needs in one place.</span>
          </Box>
        )}
        <Box className="app-sidebar-company">
          <span className="app-sidebar-company-mark">
            {(activeCompany?.name || "C").slice(0, 1).toUpperCase()}
          </span>
          <span className="app-sidebar-company-copy">
            <Typography>{activeCompany?.name || "Company workspace"}</Typography>
            <span>Active company</span>
          </span>
          <span className="app-sidebar-status-dot" />
        </Box>
        <Typography className="app-sidebar-version">
          Fortinos IT Solutions <span>•</span> v1.0.0
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Drawer
      variant={isMobile ? "temporary" : "permanent"}
      open={isMobile ? mobileOpen : undefined}
      onClose={onClose}
      ModalProps={{ keepMounted: true }}
      sx={{
        width: isMobile ? 0 : width,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: isMobile ? DRAWER_WIDTH : width,
          transition: "width 180ms ease",
          boxSizing: "border-box",
          border: 0,
          height: "100dvh",
          minHeight: "100dvh",
          backgroundColor: "#0c2048",
          color: "#c1cde2",
          borderRight: width > 0 || isMobile
            ? "1px solid rgba(255,255,255,0.08)"
            : 0,
          overflowY: "auto",
          overflowX: "hidden",
          scrollbarWidth: "none",
          visibility: isMobile || width > 0 ? "visible" : "hidden",
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
}

export { DRAWER_WIDTH };
