import { Typography, Box } from "@mui/material";

const Dashboard = () => {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Welcome to Admin Dashboard
      </Typography>
      <Typography variant="body1">
        Use the side menu to manage products, categories, orders, and users.
      </Typography>
    </Box>
  );
};

export default Dashboard;
