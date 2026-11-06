import {
  AppBar,
  Toolbar,
  Typography,
  Box,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import authService from "../../features/auth/services/authService";
import { clearCredentials } from "../../features/auth/slices/authSlice";
import { showErrorToast } from "../../components/common/ToastMessage";

export default function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      showErrorToast(error.message || "Unable to contact the server to log out.");
    } finally {
      dispatch(clearCredentials());
      dispatch(clearCompanyContext());
      navigate("/login", { replace: true });
    }
  };

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
          <Typography
            component="button"
            onClick={handleLogout}
            sx={{
              border: 0,
              background: "transparent",
              color: "#C94A1A",
              font: "inherit",
              cursor: "pointer",
            }}
          >
            Sign out
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
}