import React, { useEffect, useRef } from "react";
import ReactDOM from "react-dom/client";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import Login from "./pages/Login";
import "./index.css";
import { Dashboard } from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import { Products } from "./pages/Products";
import { useLocalStorageGet } from "./services/utils";
import DetailsProducts from "./pages/DetailsProducts";
import CreateProducts from "./pages/CreateProducts";
import Users from "./pages/Users";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface PrivateRouteProps {
  children: React.ReactNode;
}

// Componente de ruta privada
// eslint-disable-next-line react-refresh/only-export-components
const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const token = useLocalStorageGet("token", "");
  const location = useLocation();

  return token ? (
    <>{children}</>
  ) : (
    <Navigate to="/login" state={{ from: location }} />
  );
};

// eslint-disable-next-line react-refresh/only-export-components
const App: React.FC = () => {
  const timeoutRef = useRef<number | null>(null);

  const logout = () => {
    localStorage.clear();
  };

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = window.setTimeout(logout, 5 * 60 * 1000);
  };

  useEffect(() => {
    const handleUserActivity = () => {
      resetTimeout();
    };

    window.addEventListener("mousemove", handleUserActivity);
    window.addEventListener("mousedown", handleUserActivity);
    window.addEventListener("keypress", handleUserActivity);

    resetTimeout();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      window.removeEventListener("mousemove", handleUserActivity);
      window.removeEventListener("mousedown", handleUserActivity);
      window.removeEventListener("keypress", handleUserActivity);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<NotFound />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          >
            <Route
              path="products"
              element={
                <PrivateRoute>
                  <Products />
                </PrivateRoute>
              }
            />
            <Route
              path="products/:id"
              element={
                <PrivateRoute>
                  <DetailsProducts />
                </PrivateRoute>
              }
            />
            <Route
              path="products/create"
              element={
                <PrivateRoute>
                  <CreateProducts />
                </PrivateRoute>
              }
            />
            <Route
              path="users"
              element={
                <PrivateRoute>
                  <Users />
                </PrivateRoute>
              }
            />
          </Route>
        </Routes>
      </Router>
      <ToastContainer />
    </>
  );
};

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
