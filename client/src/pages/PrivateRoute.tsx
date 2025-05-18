import { Navigate, Outlet, useLocation } from "react-router-dom";
import useUserAuthStore from "../store/userAuthStore";
import useAdminAuthStore from "../store/adminAuthStore";

const PrivateRoute = () => {
  const { isUserAuthenticated, userSession } = useUserAuthStore();
  const { isAdminAuthenticated, adminSession } = useAdminAuthStore();
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  if (isAdminRoute) {
    if (!isAdminAuthenticated || !adminSession) {
      return <Navigate to="/admin/login" replace />;
    }

    if (adminSession.role !== "admin") {
      return <Navigate to="/" replace />;
    }

    return <Outlet />;
  }

  if (!isUserAuthenticated || !userSession) {
    return <Navigate to="/login" replace />;
  }

  if (userSession.role !== "user") {
    return <Navigate to="/admin" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
