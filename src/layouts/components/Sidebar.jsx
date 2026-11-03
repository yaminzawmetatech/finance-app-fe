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
} from "@mui/material";
import {
  BookOpen,
  BriefcaseBusiness,
  Building2,
  Calculator,
  ChevronDown,
  ChevronRight,
  ClipboardCheck,
  ClipboardList,
  FileText,
  HandCoins,
  LayoutDashboard,
  LockKeyhole,
  NotebookPen,
  Package,
  Settings,
  ShieldCheck,
  Sparkles,
  Tags,
  UserRound,
  Users,
  Wallet,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { NavLink, useLocation } from "react-router-dom";
import { NAVIGATION_CONFIG } from "../../config/navigationConfig";
import { filterNavigation } from "../../config/navigationHelper";

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
  LayoutDashboard,
  UserRound,
  Tags,
  BriefcaseBusiness,
  FileText,
  ClipboardCheck,
  Package,
  ClipboardList,
  BookOpen,
  NotebookPen,
};

export default function Sidebar({
  isMobile = false,
  mobileOpen = false,
  width = DRAWER_WIDTH,
  onClose,
}) {
  const location = useLocation();
  const { activeModules = [], activeCompany, subscriptionLoaded } = useSelector(
    (state) => state.company || {}
  );
  const [openMenus, setOpenMenus] = useState({ administration: true });

  const navigation = useMemo(
    () =>
      subscriptionLoaded
        ? filterNavigation(NAVIGATION_CONFIG, activeModules)
        : [],
    [activeModules, subscriptionLoaded]
  );

  const isActive = (path) =>
    Boolean(
      path &&
        (location.pathname === path ||
          (path !== "/" && location.pathname.startsWith(`${path}/`)))
    );

  const renderIcon = (iconName, size = 18) => {
    const Icon = ICONS[iconName];
    return Icon ? <Icon size={size} strokeWidth={1.8} /> : null;
  };

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
          borderRight:
            width > 0 || isMobile ? "1px solid rgba(255,255,255,0.08)" : 0,
          overflowY: "auto",
          overflowX: "hidden",
          scrollbarWidth: "none",
          visibility: isMobile || width > 0 ? "visible" : "hidden",
        },
      }}
    >
      <Box className="app-sidebar-content">
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

        <Typography className="app-sidebar-section-label">MENU</Typography>

        <List className="app-sidebar-navigation">
          {navigation.map((item) => {
            if (item.type === "group" || item.children) {
              const children = item.children || [];
              const groupActive =
                children.some((child) => isActive(child.path)) ||
                (item.id === "administration" &&
                  location.pathname === "/administration");
              const expanded =
                openMenus[item.id] ?? (groupActive || item.id === "administration");

              return (
                <Box className="app-sidebar-group" key={item.id}>
                  <ListItemButton
                    className={`app-sidebar-item app-sidebar-group-trigger${groupActive ? " is-active" : ""}`}
                    onClick={() =>
                      setOpenMenus((previous) => ({
                        ...previous,
                        [item.id]: !expanded,
                      }))
                    }
                    aria-expanded={expanded}
                  >
                    <ListItemIcon className="app-sidebar-icon">
                      {renderIcon(item.icon)}
                    </ListItemIcon>
                    <ListItemText primary={item.label} />
                    {expanded ? (
                      <ChevronDown size={16} />
                    ) : (
                      <ChevronRight size={16} />
                    )}
                  </ListItemButton>

                  <Collapse in={expanded} timeout="auto" unmountOnExit>
                    <List className="app-sidebar-subnavigation" disablePadding>
                      {children.map((child) => {
                        const active = isActive(child.path);
                        return (
                          <ListItemButton
                            key={child.id}
                            component={NavLink}
                            to={child.path}
                            onClick={isMobile ? onClose : undefined}
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
              <ListItemButton
                key={item.id}
                component={NavLink}
                to={item.path}
                onClick={isMobile ? onClose : undefined}
                className={`app-sidebar-item${active ? " is-active is-current" : ""}`}
                aria-current={active ? "page" : undefined}
              >
                <ListItemIcon className="app-sidebar-icon">
                  {renderIcon(item.icon)}
                </ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            );
          })}
        </List>

        <Box className="app-sidebar-bottom">
          <Box className="app-sidebar-promo">
            <Sparkles className="app-sidebar-promo-spark" size={18} />
            <Typography>Finance, made clearer.</Typography>
            <span>Everything your team needs in one place.</span>
          </Box>
          <Box className="app-sidebar-company">
            <span className="app-sidebar-company-mark">
              {(activeCompany?.name || "C").slice(0, 1).toUpperCase()}
            </span>
            <span className="app-sidebar-company-copy">
              <Typography>
                {activeCompany?.name || "Company workspace"}
              </Typography>
              <span>Active company</span>
            </span>
            <span className="app-sidebar-status-dot" />
          </Box>
          <Typography className="app-sidebar-version">
            Fortinos IT Solutions <span>•</span> v1.0.0
          </Typography>
        </Box>
      </Box>
    </Drawer>
  );
}

export { DRAWER_WIDTH };
