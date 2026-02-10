import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuthContext = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    // Initialize state from localStorage if available
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : null;
    });

    const [accessToken, setAccessToken] = useState(() => {
        return localStorage.getItem("accessToken") || null;
    });

    // Update localStorage when state changes
    useEffect(() => {
        if (user) {
            localStorage.setItem("user", JSON.stringify(user));
        } else {
            localStorage.removeItem("user");
        }
    }, [user]);

    useEffect(() => {
        if (accessToken) {
            localStorage.setItem("accessToken", accessToken);
        } else {
            localStorage.removeItem("accessToken");
        }
    }, [accessToken]);

    const login = (token, userData) => {
        setAccessToken(token);
        setUser(userData);
    };

    const logout = () => {
        setAccessToken(null);
        setUser(null);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        localStorage.removeItem("refreshToken"); // Ensure this is also cleared
    };

    return (
        <AuthContext.Provider value={{ user, accessToken, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
