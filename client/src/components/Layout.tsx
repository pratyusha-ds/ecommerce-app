import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Box } from "@mui/material";

const Layout: React.FC = () => {
  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <Navbar />
      <Box component="main" flexGrow={1} sx={{ mt: 2 }}>
        <Outlet />
      </Box>
      <Footer />
    </Box>
  );
};

export default Layout;
