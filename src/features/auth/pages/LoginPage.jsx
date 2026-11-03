import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  MenuItem,
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
    <Box className="login-page">
      <section className="login-brand-panel">
        <div className="login-brand-content">
          <img
            className="login-logo"
            src="/fortinos-logo.png"
            alt="Fortinos IT Solutions"
          />
          <div className="login-brand-copy">
            <span className="login-brand-eyebrow">FINANCIAL OPERATIONS PLATFORM</span>
            <Typography component="h1" className="login-brand-title">
              Clarity for every
              <br />
              financial decision.
            </Typography>
            <Typography className="login-brand-description">
              A connected workspace to manage your people, lending, and
              day-to-day operations with confidence.
            </Typography>
          </div>
          <div className="login-brand-footer">
            <span className="login-brand-dot" />
            Built for smarter financial operations
          </div>
        </div>
        <div className="login-decoration login-decoration--one" />
        <div className="login-decoration login-decoration--two" />
      </section>

      <section className="login-form-panel">
        <div className="login-form-wrap">
          <div className="login-mobile-logo">
            <img src="/fortinos-logo.png" alt="Fortinos IT Solutions" />
          </div>
          <span className="login-form-eyebrow">WELCOME BACK</span>
          <Typography component="h2" className="login-form-title">
            Sign in to your account
          </Typography>
          <Typography className="login-form-description">
            Enter your details to access your company workspace.
          </Typography>

          <Box component="form" onSubmit={handleLogin} className="login-form">
            <TextField
              select
              label="Choose a test company"
              value={email}
              onChange={(event) => selectTestAccount(event.target.value)}
              fullWidth
            >
              {TEST_ACCOUNTS.map((account) => (
                <MenuItem key={account.email} value={account.email}>
                  {account.label}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Email address"
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

            {error && <Alert severity="error">{error}</Alert>}

            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              className="login-submit"
            >
              Sign in
            </Button>
          </Box>

          <div className="login-help">
            <span className="login-help-mark">i</span>
            <p>
              Demo access is enabled. Choose a company above; all test
              accounts use password <strong>123456</strong>.
            </p>
          </div>
          <Typography className="login-copyright">
            © Fortinos IT Solutions
          </Typography>
        </div>
      </section>
    </Box>
  );
}