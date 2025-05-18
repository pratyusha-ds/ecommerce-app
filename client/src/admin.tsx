import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AdminLayout from "./pages/admin/components/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import CategoriesManagement from "./pages/admin/CategoriesManagement";
import ProductsManagement from "./pages/admin/ProductsManagement";
import OrdersManagement from "./pages/admin/OrdersManagement";
import UsersManagement from "./pages/admin/UsersManagement";
import AdminLoginForm from "./pages/admin/AdminLoginForm";
import PrivateRoute from "./pages/PrivateRoute";
import { ApolloProvider } from "@apollo/client";
import { client } from "./apolloClient";

const adminRouter = createBrowserRouter([
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

const AdminApp: React.FC = () => {
  return <RouterProvider router={adminRouter} />;
};

ReactDOM.createRoot(document.getElementById("admin-root")!).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <AdminApp />
    </ApolloProvider>
  </React.StrictMode>
);
