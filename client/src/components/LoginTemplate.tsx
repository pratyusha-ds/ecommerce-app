import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Alert,
  Link,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

const LoginTemplate = ({
  title = "Login",
  email,
  setEmail,
  password,
  setPassword,
  error,
  loading,
  handleLogin,
  isAuthenticated,
  handleLogout,
}: {
  title?: string;
  email: string;
  setEmail: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  error: string | null;
  loading: boolean;
  handleLogin: () => void;
  isAuthenticated: boolean;
  handleLogout?: () => void;
}) => (
  <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    minHeight="100vh"
    bgcolor="#f5f5f5"
  >
    <Card sx={{ width: 400, p: 2 }}>
      <CardContent>
        <Typography variant="h5" component="h2" gutterBottom>
          {title}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <TextField
          fullWidth
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          margin="normal"
        />

        <TextField
          fullWidth
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          margin="normal"
        />

        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={handleLogin}
          sx={{ mt: 2 }}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </Button>

        <Typography variant="body2" align="center" sx={{ mt: 2 }}>
          Not registered?{" "}
          <Link component={RouterLink} to="/register">
            Click here
          </Link>
        </Typography>

        {isAuthenticated && handleLogout && (
          <Button
            fullWidth
            variant="outlined"
            color="secondary"
            onClick={handleLogout}
            sx={{ mt: 2 }}
          >
            Logout
          </Button>
        )}
      </CardContent>
    </Card>
  </Box>
);

export default LoginTemplate;
