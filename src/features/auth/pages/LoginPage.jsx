import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Container,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

import { mockAuthService } from "../services/mockAuthService";
import { setCredentials } from "../slices/authSlice";
import { setCompanyContext } from "../../subscriptions/slices/companySlice";

const TEST_ACCOUNTS = [
  {
    label: "Company A",
    email: "admin@companya.com",
    password: "123456",
  },
  {
    label: "Company B",
    email: "admin@companyb.com",
    password: "123456",
  },
  {
    label: "Company C",
    email: "admin@companyc.com",
    password: "123456",
  },
];

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("admin@companya.com");
  const [password, setPassword] = useState("123456");
  const [error, setError] = useState("");

  const handleLogin = (event) => {
    event.preventDefault();
    setError("");

    try {
      const session = mockAuthService.login(email, password);

      dispatch(
        setCredentials({
          id: session.id,
          name: session.name,
          email: session.email,
          companyId: session.company.id,
        })
      );

      dispatch(
        setCompanyContext({
          company: session.company,
          modules: session.modules,
        })
      );

      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message || "Unable to log in.");
    }
  };

  const selectTestAccount = (selectedEmail) => {
    const account = TEST_ACCOUNTS.find(
      (item) => item.email === selectedEmail
    );

    if (account) {
      setEmail(account.email);
      setPassword(account.password);
      setError("");
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Paper
          elevation={4}
          sx={{
            p: 4,
            width: "100%",
            borderRadius: 3,
          }}
        >
          <Typography
            variant="h4"
            fontWeight={700}
            textAlign="center"
            gutterBottom
          >
            Microfinance System
          </Typography>

          <Typography
            color="text.secondary"
            textAlign="center"
            sx={{ mb: 3 }}
          >
            Sign in to your company account
          </Typography>

          <Box
            component="form"
            onSubmit={handleLogin}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <TextField
              select
              label="Test Company"
              value={email}
              onChange={(event) =>
                selectTestAccount(event.target.value)
              }
              fullWidth
            >
              {TEST_ACCOUNTS.map((account) => (
                <MenuItem
                  key={account.email}
                  value={account.email}
                >
                  {account.label}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="username"
              required
              fullWidth
            />

            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
              fullWidth
            />

            {error && (
              <Alert severity="error">
                {error}
              </Alert>
            )}

            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              sx={{ py: 1.3 }}
            >
              Login
            </Button>
          </Box>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 3 }}
          >
            Testing: Select a company above or enter its credentials.
            All test accounts use password 123456.
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
}