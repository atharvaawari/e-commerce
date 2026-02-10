import { Navigate, Outlet } from "react-router";
import useAuth from "../hooks/api/use-auth.jsx";

const AdminRoute = () => {
    const { data: authData, isLoading, isFetching, status } = useAuth();
    const user = authData?.user;

    if (status === "pending" || isLoading || isFetching) {
        return <div>Checking permissions...</div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (user.role !== 'admin') {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default AdminRoute;
