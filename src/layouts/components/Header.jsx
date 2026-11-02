
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
} from "@mui/material";


export default function Header() {
  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        bgcolor: "#FFFFFF",
        color: "#172033",
        borderBottom: "1px solid #E5E7EB",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Typography variant="h6" fontWeight={700}>
          Finance Management System
        </Typography>

        {/* <Box>
          <LogoutButton />
        </Box> */}
      </Toolbar>
    </AppBar>
  );
}