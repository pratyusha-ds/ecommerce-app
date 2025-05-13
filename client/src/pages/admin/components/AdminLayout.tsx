import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Typography,
  Button,
} from "@mui/material";
import useAuthStore from "../../../store/adminAuthStore";

const navItems = [
  { text: "Categories", path: "/admin/categories" },
  { text: "Products", path: "/admin/products" },
  { text: "Orders", path: "/admin/orders" },
  { text: "Users", path: "/admin/users" },
];

const AdminLayout: React.FC = () => {
  const location = useLocation();
  const logoutAdmin = useAuthStore((state) => state.logoutAdmin);

  const handleLogout = () => {
    logoutAdmin();
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Drawer
        variant="permanent"
        sx={{
          width: 240,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: 240,
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          },
        }}
      >
        <Box>
          <Box sx={{ p: 2 }}>
            <Typography variant="h6">Admin Panel</Typography>
          </Box>
          <List>
            {navItems.map((item) => (
              <ListItemButton
                key={item.text}
                component={Link}
                to={item.path}
                selected={location.pathname === item.path}
              >
                <ListItemText primary={item.text} />
              </ListItemButton>
            ))}
          </List>
        </Box>

        <Box sx={{ p: 2 }}>
          <Button
            fullWidth
            variant="contained"
            color="error"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Box>
      </Drawer>

      <Box sx={{ flexGrow: 1, p: 4 }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default AdminLayout;
