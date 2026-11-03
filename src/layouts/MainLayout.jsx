import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

export default function MainLayout() {
  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        minHeight: "100vh",
        bgcolor: "#F7F5F2",
      }}
    >
      {/* Sidebar */}
      <Sidebar />

      {/* Main Application */}
      <Box
        sx={{
          flex: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          bgcolor: "#F7F5F2",
        }}
      >
        {/* Header */}
        <Header />

        {/* Page Content */}
        <Box
          component="main"
          sx={{
            flex: 1,
            p: {
              xs: 2,
              sm: 2.5,
              md: 3,
              lg: 3.5,
            },
            width: "100%",
            minWidth: 0,
            bgcolor: "#F7F5F2",
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}