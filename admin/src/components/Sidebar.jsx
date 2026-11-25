import { NavLink, useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    Users,
    UserRound,
    LogOut,
    Shield,
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
                <div className="brand-icon admin-brand-icon">
                    <Shield size={20} />
                </div>
                <div>
                    <span>AdminHub</span>
                    <span className="brand-badge">CONTROL PANEL</span>
                </div>
            </div>

            <div className="sidebar-label">ADMIN NAVIGATION</div>

            <nav className="sidebar-nav">
                <NavLink
                    to="/dashboard"
                    className={({ isActive }) =>
                        isActive ? "nav-item active" : "nav-item"
                    }
                >
                    <LayoutDashboard size={19} />
                    Overview
                </NavLink>

                <NavLink
                    to="/users"
                    className={({ isActive }) =>
                        isActive ? "nav-item active" : "nav-item"
                    }
                >
                    <Users size={19} />
                    User Management
                </NavLink>

                <NavLink
                    to="/profile"
                    className={({ isActive }) =>
                        isActive ? "nav-item active" : "nav-item"
                    }
                >
                    <UserRound size={19} />
                    Admin Profile
                </NavLink>
            </nav>

            <div className="sidebar-bottom">
                <div className="sidebar-user">
                    <div className="avatar admin-avatar">
                        {user?.name?.charAt(0).toUpperCase()}
                    </div>

                    <div className="sidebar-user-info">
                        <strong>{user?.name}</strong>
                        <span>{user?.email}</span>
                        <span className="role-tag">Administrator</span>
                    </div>
                </div>

                <button className="logout-btn" onClick={handleLogout}>
                    <LogOut size={18} />
                    Sign Out
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
