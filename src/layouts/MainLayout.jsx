import { Box, useMediaQuery } from "@mui/material";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";

export default function MainLayout() {
  const isMobile = useMediaQuery("(max-width: 899px)");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true);
  const sidebarWidth = desktopSidebarOpen ? 264 : 0;

  return (
    <Box
      className="app-shell"
      sx={{
        display: "flex",
        width: "100%",
        minHeight: "100vh",
        height: "100dvh",
        overflow: "hidden",
        bgcolor: "#ffffff",
      }}
    >
      <Sidebar
        isMobile={isMobile}
        mobileOpen={isMobile && mobileMenuOpen}
        width={sidebarWidth}
        onClose={() => setMobileMenuOpen(false)}
      />

      <Box
        sx={{
          flex: 1,
          minWidth: 0,
          minHeight: 0,
          height: "100dvh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Header
          isMobile={isMobile}
          menuOpen={isMobile ? mobileMenuOpen : desktopSidebarOpen}
          onMenuClick={() => {
            if (isMobile) {
              setMobileMenuOpen((open) => !open);
            } else {
              setDesktopSidebarOpen((open) => !open);
            }
          }}
        />

        <Box
          component="main"
          className="app-content"
          sx={{
            flex: 1,
            minHeight: 0,
            p: {
              xs: 2,
              sm: 2.5,
              md: 3,
              lg: 3.5,
            },
            width: "100%",
            minWidth: 0,
            overflowY: "auto",
            scrollbarWidth: "none",
          }}
        >
          <Outlet />
        </Box>

        <Box component="footer" className="app-shell-footer">
          <span>© Fortinos IT Solutions</span>
          <span>Financial operations workspace</span>
        </Box>
      </Box>
    </Box>
  );
}
