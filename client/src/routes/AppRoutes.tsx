import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "../components/Layout";
import HomePage from "../pages/HomePage";
import CategoryPage from "../pages/CategoryPage";
import ProductPage from "../pages/ProductPage";
import CartPage from "../pages/CartPage";
import CheckoutPage from "../pages/CheckoutPage";
import SuccessPage from "../pages/SuccessPage";
import SearchPage from "../pages/SearchPage";
import PrivateRoute from "../pages/PrivateRoute";
import RegisterForm from "../pages/RegisterForm";
import LoginForm from "../pages/LoginForm";
import Profile from "../pages/Profile";
import AdminLayout from "../pages/admin/components/AdminLayout";
import Dashboard from "../pages/admin/Dashboard";
import CategoriesManagement from "../pages/admin/CategoriesManagement";
import ProductsManagement from "../pages/admin/ProductsManagement";
import OrdersManagement from "../pages/admin/OrdersManagement";
import UsersManagement from "../pages/admin/UsersManagement";
import AdminLoginForm from "../pages/admin/AdminLoginForm";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "", element: <HomePage /> },
      { path: "category/:categoryId", element: <CategoryPage /> },
      { path: "product/:productId", element: <ProductPage /> },
      { path: "search", element: <SearchPage /> },
      { path: "cart", element: <CartPage /> },
      { path: "register", element: <RegisterForm /> },
      { path: "login", element: <LoginForm /> },
      {
        element: <PrivateRoute />,
        children: [
          { path: "checkout", element: <CheckoutPage /> },
          { path: "order-success", element: <SuccessPage /> },
          { path: "profile", element: <Profile /> },
        ],
      },
    ],
  },
  {
    path: "/admin/login",
    element: <AdminLoginForm />,
  },
  {
    path: "/admin",
    element: <PrivateRoute />,
    children: [
      {
        path: "",
        element: <AdminLayout />,
        children: [
          { index: true, element: <Dashboard /> },
          { path: "categories", element: <CategoriesManagement /> },
          { path: "products", element: <ProductsManagement /> },
          { path: "orders", element: <OrdersManagement /> },
          { path: "users", element: <UsersManagement /> },
        ],
      },
    ],
  },
]);

const AppRoutes: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default AppRoutes;
