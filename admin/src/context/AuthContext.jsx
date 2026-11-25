import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

import api from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Verify current admin session
    const checkAuth = async () => {
        try {
            const response = await api.get("/auth/profile");
            const userData = response.data.user;

            if (userData && userData.role === "admin") {
                setUser(userData);
            } else {
                // Not an admin
                setUser(null);
            }
        } catch (error) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    // Admin Login
    const login = async (formData) => {
        const response = await api.post("/auth/login", formData);
        const userData = response.data.user;

        if (userData.role !== "admin") {
            // Immediately logout regular user
            try {
                await api.post("/auth/logout");
            } catch (_) {}
            setUser(null);
            throw new Error("Access denied. Administrator privileges required.");
        }

        setUser(userData);
        return response.data;
    };

    // Logout
    const logout = async () => {
        try {
            await api.post("/auth/logout");
        } finally {
            setUser(null);
        }
    };

    // Update Profile
    const updateProfile = async (formData) => {
        const response = await api.put("/auth/profile", formData);
        setUser(response.data.user);
        return response.data;
    };

    // Change Password
    const changePassword = async (formData) => {
        const response = await api.put("/auth/change-password", formData);
        setUser(null);
        return response.data;
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                logout,
                updateProfile,
                changePassword,
                checkAuth,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
