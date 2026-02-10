import { Navigate, Outlet } from "react-router";
import { useAuthContext } from "../context/AuthContext.jsx";

const ProtectedRoute = () => {
  const { user } = useAuthContext();

  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
