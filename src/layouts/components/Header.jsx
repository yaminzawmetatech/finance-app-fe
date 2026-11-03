import {
  AppBar,
  Avatar,
  Box,
  ClickAwayListener,
  IconButton,
  InputBase,
  Paper,
  Tooltip,
  Toolbar,
  Typography,
} from "@mui/material";
import { LogOut, Menu, Search, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { NAVIGATION_CONFIG } from "../../config/navigationConfig";
import { clearCredentials } from "../../features/auth/slices/authSlice";
import { mockAuthService } from "../../features/auth/services/mockAuthService";
import { clearCompanyContext } from "../../features/subscriptions/slices/companySlice";

function getPageTitle(pathname) {
  for (const item of NAVIGATION_CONFIG) {
    if (item.type === "group" || item.children) {
      if (pathname === `/${item.id}`) return item.label;
      const child = item.children?.find((entry) =>
        pathname.startsWith(entry.path)
      );
      if (child) return child.label;
    } else if (item.path && pathname.startsWith(item.path)) {
      return item.label;
    }
  }

  return "Workspace";
}

export default function Header({
  onMenuClick,
  isMobile = false,
  menuOpen = true,
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state) => state.auth.user);
  const company = useSelector((state) => state.company.activeCompany);
  const activeModules = useSelector((state) => state.company.activeModules);
  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const searchInputRef = useRef(null);
  const title = getPageTitle(location.pathname);
  const searchItems = useMemo(
    () =>
      NAVIGATION_CONFIG.flatMap((item) =>
        item.type === "group" || item.children
          ? (item.children || []).filter((child) =>
              !child.module || activeModules.includes(child.module)
            )
          : !item.module || activeModules.includes(item.module)
            ? [{ label: item.label, path: item.path }]
            : []
      ),
    [activeModules]
  );
  const searchResults = searchItems
    .filter((item) =>
      item.label.toLowerCase().includes(search.trim().toLowerCase())
    )
    .slice(0, 5);
  const initials = (user?.name || "User")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");

  useEffect(() => {
    const handleShortcut = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleShortcut);
    return () => document.removeEventListener("keydown", handleShortcut);
  }, []);

  const handleLogout = () => {
    mockAuthService.logout();
    dispatch(clearCredentials());
    dispatch(clearCompanyContext());
    navigate("/login", { replace: true });
  };

  return (
    <AppBar className="app-topbar" position="sticky" elevation={0}>
      <Toolbar className="app-topbar-toolbar">
        <IconButton
          className="app-mobile-menu"
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          onClick={onMenuClick}
          edge="start"
        >
          {isMobile && menuOpen ? <X size={21} /> : <Menu size={21} />}
        </IconButton>

        <Box className="app-topbar-heading">
          <Typography className="app-topbar-kicker">
            {company?.name || "FINANCIAL WORKSPACE"}
          </Typography>
          <Typography component="h1" className="app-topbar-title">
            {title}
          </Typography>
        </Box>

        <ClickAwayListener onClickAway={() => setSearchOpen(false)}>
          <Box className="app-topbar-search-wrap">
            <Box className={`app-topbar-search${searchOpen ? " is-focused" : ""}`}>
              <Search size={17} />
              <InputBase
                inputRef={searchInputRef}
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setSearchOpen(true);
                }}
                onFocus={() => setSearchOpen(true)}
                onKeyDown={(event) => {
                  if (event.key === "Escape") {
                    setSearch("");
                    setSearchOpen(false);
                  }
                }}
                placeholder="Search pages..."
                inputProps={{ "aria-label": "Search pages" }}
              />
              {search ? (
                <IconButton
                  className="app-topbar-search-clear"
                  aria-label="Clear search"
                  onClick={() => setSearch("")}
                >
                  <X size={15} />
                </IconButton>
              ) : (
                <kbd>Ctrl K</kbd>
              )}
            </Box>
            {searchOpen && (
              <Paper className="app-topbar-search-results" elevation={8}>
                <Typography className="app-topbar-search-label">
                  {search ? "MATCHING PAGES" : "QUICK LINKS"}
                </Typography>
                {searchResults.length ? (
                  searchResults.map((item) => (
                    <Link
                      className="app-topbar-search-result"
                      key={item.path}
                      to={item.path}
                      onClick={() => {
                        setSearch("");
                        setSearchOpen(false);
                      }}
                    >
                      <span>{item.label}</span>
                      <span aria-hidden="true">›</span>
                    </Link>
                  ))
                ) : (
                  <Typography className="app-topbar-search-empty">
                    No pages match “{search}”.
                  </Typography>
                )}
              </Paper>
            )}
          </Box>
        </ClickAwayListener>

        <Box className="app-topbar-actions">
          <Box className="app-topbar-company">
            <span className="app-topbar-company-dot" />
            <Typography>{company?.name || "Workspace"}</Typography>
          </Box>
          <Box className="app-topbar-user">
            <Avatar className="app-topbar-avatar">{initials}</Avatar>
            <Box className="app-topbar-user-copy">
              <Typography>{user?.name || "Workspace user"}</Typography>
              <span>{user?.email || "Signed in"}</span>
            </Box>
          </Box>
          <Tooltip title="Sign out">
            <IconButton
              className="app-topbar-logout"
              aria-label="Sign out"
              onClick={handleLogout}
            >
              <LogOut size={18} />
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
