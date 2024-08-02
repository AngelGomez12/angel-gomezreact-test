import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import Login from "../src/pages/Login";
import "./index.css";
import { Dashboard } from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import { Products } from "./pages/Products";
import { useLocalStorageGet } from "./services/utils";
import DetailsProducts from "./pages/DetailsProducts";
import CreateProducts from "./pages/CreateProducts";
import Users from "./pages/Users";

interface PrivateRouteProps {
  component: React.ComponentType<unknown>;
}

// eslint-disable-next-line react-refresh/only-export-components
const PrivateRoutes: React.FC<PrivateRouteProps> = ({
  component: Component,
  ...rest
}) => {
  const token = useLocalStorageGet("token", "");
  return token ? <Component {...rest} /> : <Navigate to="/login" />;
};

const router = createBrowserRouter([
  {
    // Rutas publicas
    path: "/login",
    element: <Login />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
  {
    // Rutas privadas
    path: "/dashboard/*",
    element: <PrivateRoutes component={Dashboard} />,
    children: [
      {
        path: "products",
        element: <PrivateRoutes component={Products} />,
      },
      {
        path: "products/:id",
        element: <PrivateRoutes component={DetailsProducts} />,
      },
      {
        path: "create",
        element: <PrivateRoutes component={CreateProducts} />,
      },
      {
        path: "users",
        element: <PrivateRoutes component={Users} />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
