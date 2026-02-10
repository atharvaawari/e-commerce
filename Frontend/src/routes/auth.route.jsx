import { Navigate, Outlet, useLocation } from "react-router";
import useAuth from "../hooks/api/use-auth.jsx";

const AuthRoute = () => {
  const location = useLocation();
  const { data: authData, isLoading } = useAuth();

  const user = authData?.user;

  const _isAuthRoute = ["/login", "/register"].includes(location.pathname);

  if (!_isAuthRoute) {
    return <Outlet />;
  }

  // Still checking auth
  if (isLoading) {
    return <div>Loading...</div>;
  }

   // Already logged in → redirect away from login/register
  if (user) {
    return <Navigate to={`/home`} replace />;
  }

  return <Outlet />;

  // return <Navigate to={`dashboard/${user?._id}`} />;
};

export default AuthRoute;