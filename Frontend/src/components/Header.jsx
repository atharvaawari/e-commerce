import React from "react";
import { ShoppingCartOutlined, HeartOutlined, UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { Layout, Button, Badge, Avatar, Dropdown, Space } from "antd";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useAuthContext } from "../context/AuthContext";
import { logoutMutationFn } from "../lib/api";


const Header = () => {
    const navigate = useNavigate();
    const { cart } = useCart();
    const { wishlist } = useWishlist();
    const { user, logout } = useAuthContext();

    const { mutate: logoutUser } = useMutation({
        mutationFn: logoutMutationFn,
        onSuccess: () => {
            logout();
            navigate("/login");
        },
    });

    const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

    const handleLogout = () => {
        logoutUser();
    };

    const profileMenuInems = [
        {
            key: "logout",
            label: "Logout",
            icon: <LogoutOutlined />,
            onClick: handleLogout,
        },
    ];

    return (
        <header className="flex justify-between items-center bg-white px-6 shadow-sm z-10 sticky top-0 w-full h-16 border-b border-gray-100">
            <div
                className="text-xl font-bold cursor-pointer text-blue-600 tracking-tight"
                onClick={() => navigate("/")}
            >
                E-Shop
            </div>

            <div className="flex gap-4 items-center">
                <Badge count={cartCount} showZero offset={[-4, 4]}>
                    <Button
                        type="text"
                        icon={<ShoppingCartOutlined className="text-xl text-gray-600 hover:text-blue-500 transition-colors" />}
                        onClick={() => navigate("/cart")}
                        className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-50"
                    />
                </Badge>

                <Badge count={wishlist.length} showZero offset={[-4, 4]}>
                    <Button
                        type="text"
                        icon={<HeartOutlined className="text-xl text-gray-600 hover:text-red-500 transition-colors" />}
                        onClick={() => navigate("/wishlist")}
                        className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-50"
                    />
                </Badge>

                {user ? (
                    <Dropdown menu={{ items: profileMenuInems }} placement="bottomRight" arrow>
                        <Space className="cursor-pointer hover:bg-gray-50 px-2 py-1 rounded-full transition-colors">
                            <Avatar icon={<UserOutlined />} src={user?.image} className="bg-blue-100 text-blue-600" />
                            <span className="hidden md:inline font-medium text-gray-700">{user?.name}</span>
                        </Space>
                    </Dropdown>
                ) : (
                    <Button type="primary" onClick={() => navigate("/login")} className="bg-blue-600 hover:bg-blue-700 rounded-full">
                        Login
                    </Button>
                )}
            </div>
        </header>
    );
};

export default Header;
