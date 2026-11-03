import {
  AppBar,
  Toolbar,
  Typography,
  Box,
} from "@mui/material";

export default function Header() {
  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: "#FFFFFF",
        color: "#343434",
        borderBottom: "1px solid #EEE7E0",
        zIndex: 1100,
      }}
    >
      <Toolbar
        sx={{
          minHeight: "64px !important",
          px: { xs: 2, md: 3 },
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        {/* Page Branding */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          <Box
            sx={{
              width: 4,
              height: 25,
              borderRadius: 2,
              bgcolor: "#F07E2C",
            }}
          />

          <Typography
            variant="h6"
            sx={{
              fontSize: { xs: 16, md: 18 },
              fontWeight: 700,
              color: "#343434",
              letterSpacing: "-0.3px",
            }}
          >
            Finance Management System
          </Typography>
        </Box>

        {/* Header Actions */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          {/* Add notifications, profile and logout here */}
        </Box>
      </Toolbar>
    </AppBar>
  );
}