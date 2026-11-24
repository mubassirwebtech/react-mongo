import { NavLink, useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    UserRound,
    LogOut,
    Settings,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate("/login", { replace: true });
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <aside className="sidebar">

            <div className="sidebar-brand">
                <div className="brand-icon">A</div>
                <span>AccountHub</span>
            </div>

            <div className="sidebar-label">MENU</div>

            <nav className="sidebar-nav">

                <NavLink to="/dashboard" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                    <LayoutDashboard size={19} />
                    Dashboard
                </NavLink>

                <NavLink to="/profile" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                    <UserRound size={19} />
                    My Profile
                </NavLink>

            </nav>

            <div className="sidebar-bottom">

                <div className="sidebar-user">
                    <div className="avatar">
                        {user?.name?.charAt(0).toUpperCase()}
                    </div>

                    <div className="sidebar-user-info">
                        <strong>{user?.name}</strong>
                        <span>{user?.email}</span>
                    </div>
                </div>

                <button className="logout-btn" onClick={handleLogout}>
                    <LogOut size={18} />
                    Logout
                </button>

            </div>

        </aside>
    );
};

export default Sidebar;