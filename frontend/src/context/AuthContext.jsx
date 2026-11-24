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

    // Check existing login
    const checkAuth = async () => {
        try {
            const response = await api.get("/auth/profile");

            setUser(response.data.user);
        } catch (error) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    // Register
    const register = async (formData) => {
        const response = await api.post(
            "/auth/register",
            formData
        );

        setUser(response.data.user);

        return response.data;
    };

    // Login
    const login = async (formData) => {
        const response = await api.post(
            "/auth/login",
            formData
        );

        setUser(response.data.user);

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
        const response = await api.put(
            "/auth/profile",
            formData
        );

        setUser(response.data.user);

        return response.data;
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                register,
                login,
                logout,
                updateProfile,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};