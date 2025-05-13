import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Stack,
  Menu,
  MenuItem,
  Snackbar,
  Alert as MuiAlert,
} from "@mui/material";
import {
  ShoppingCart,
  Search,
  AccountCircle,
  ExitToApp,
} from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../store/userAuthStore";
import { removeToken } from "../utils/authService";
import Badge from "@mui/material/Badge";
import useCartStore from "../store/cartStore";

const Navbar: React.FC = () => {
  const { isUserAuthenticated, logoutUser } = useAuthStore();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const { items } = useCartStore();
  const uniqueItemCount = items.length;
  const navigate = useNavigate();

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logoutUser();
    removeToken();
    setOpenSnackbar(true);
    handleMenuClose();
    navigate("/login");
  };

  const handleSnackbarClose = (_: any, reason?: string) => {
    if (reason === "clickaway") return;
    setOpenSnackbar(false);
  };

  return (
    <>
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              flexGrow: 1,
              textDecoration: "none",
              color: "inherit",
              fontWeight: "bold",
            }}
          >
            E-Shop
          </Typography>

          <Stack direction="row" spacing={2}>
            <IconButton color="inherit" component={Link} to="/search">
              <Search />
            </IconButton>

            <IconButton color="inherit" component={Link} to="/cart">
              <Badge badgeContent={uniqueItemCount} color="secondary">
                <ShoppingCart />
              </Badge>
            </IconButton>

            {isUserAuthenticated ? (
              <>
                {
                  <>
                    <IconButton color="inherit" onClick={handleMenuOpen}>
                      <ExitToApp />
                    </IconButton>

                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={handleMenuClose}
                    >
                      <MenuItem
                        component={Link}
                        to="/profile"
                        onClick={handleMenuClose}
                      >
                        Profile
                      </MenuItem>
                      <MenuItem onClick={handleLogout}>Logout</MenuItem>
                    </Menu>
                  </>
                }
              </>
            ) : (
              <IconButton color="inherit" component={Link} to="/login">
                <AccountCircle />
              </IconButton>
            )}
          </Stack>
        </Toolbar>
      </AppBar>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <MuiAlert
          onClose={handleSnackbarClose}
          severity="success"
          sx={{
            width: "100%",
            backgroundColor: "#89CFF0",
            color: "#00008B",
            fontWeight: "bold",
          }}
        >
          Successfully logged out!
        </MuiAlert>
      </Snackbar>
    </>
  );
};

export default Navbar;
