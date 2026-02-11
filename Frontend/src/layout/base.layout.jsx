import { Outlet } from "react-router";
import Chatbot from "../components/Chatbot.jsx";
import Header from "../components/Header.jsx";
import { useAuthContext } from "../context/AuthContext";

const BaseLayout = () => {
  const { user } = useAuthContext();

  return (
    <div className="flex flex-col w-full min-h-screen bg-gray-50">
      {user && user.role !== 'admin' ? <Header /> : null}
      <div className="flex-1 flex items-center justify-center w-full">
        <div className="w-full flex items-center justify-center">
          <Outlet />
        </div>
      </div>
      {user && user.role !== 'admin' ? <Chatbot /> : null}
    </div>
  );
};

export default BaseLayout;
