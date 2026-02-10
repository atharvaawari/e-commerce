import { Outlet } from "react-router";

const AppLayout = () => {
  return (
    <div className="app-layout">
        <Outlet />
    </div>
  );
}