
import { Box, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";

const NAVIGATION = [
  {
    label: "Administration",
    module: "administration",
    path: "/administration",
  },
  {
    label: "Credit Management",
    module: "credit-management",
    path: "/credit-management",
  },
  {
    label: "Loan Management",
    module: "loan-management",
    path: "/loan-management",
  },
  {
    label: "Collection",
    module: "collection",
    path: "/collection",
  },
  {
    label: "Finance",
    module: "finance",
    path: "/finance",
  },
];

export default function Sidebar() {
  const activeModules = useSelector(
    (state) => state.company?.activeModules ?? []
  );

  const activeCompany = useSelector(
    (state) => state.company?.activeCompany
  );

  return (
    <Box
      sx={{
        width: 260,
        minWidth: 260,
        bgcolor: "#172033",
        color: "#FFFFFF",
        minHeight: "100vh",
        p: 2,
      }}
    >
      <Typography variant="h6" fontWeight={700}>
        MICROFINANCE
      </Typography>

      <Typography variant="caption" color="#AAB4C5">
        {activeCompany?.name || "Company"}
      </Typography>

      <Box sx={{ mt: 4 }}>
        {NAVIGATION.filter((item) =>
          activeModules.includes(item.module)
        ).map((item) => (
          <Box key={item.module} sx={{ mb: 2 }}>
            <NavLink
              to={item.path}
              style={({ isActive }) => ({
                color: isActive ? "#F07E2C" : "#FFFFFF",
                textDecoration: "none",
                fontWeight: 600,
              })}
            >
              {item.label}
            </NavLink>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
