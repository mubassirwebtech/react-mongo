import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    Users,
    Shield,
    UserCheck,
    CalendarDays,
    Activity,
    ArrowUpRight,
    RefreshCw,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import api from "../services/api";

const Dashboard = () => {
    const { user } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError("");
            const response = await api.get("/admin/users");
            setUsers(response.data.users || []);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to load dashboard data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const totalUsers = users.length;
    const adminCount = users.filter((u) => u.role === "admin").length;
    const standardUserCount = totalUsers - adminCount;

    const stats = [
        {
            title: "Total Accounts",
            value: totalUsers,
            sub: "All registered users",
            icon: Users,
            color: "stat-indigo",
        },
        {
            title: "Administrators",
            value: adminCount,
            sub: "Full admin privileges",
            icon: Shield,
            color: "stat-purple",
        },
        {
            title: "Standard Users",
            value: standardUserCount,
            sub: "Normal platform users",
            icon: UserCheck,
            color: "stat-teal",
        },
        {
            title: "System Status",
            value: "Healthy",
            sub: "API & MongoDB Connected",
            icon: Activity,
            color: "stat-green",
        },
    ];

    const recentUsers = users.slice(0, 5);

    return (
        <div className="page-content">
            <div className="topbar">
                <div>
                    <span className="breadcrumb">Pages / Control Panel</span>
                    <h2>Admin Overview</h2>
                </div>

                <div className="topbar-actions">
                    <button
                        className="secondary-btn"
                        onClick={fetchUsers}
                        disabled={loading}
                        title="Refresh Data"
                    >
                        <RefreshCw size={16} className={loading ? "spin" : ""} />
                        <span>Refresh</span>
                    </button>
                    <div className="topbar-avatar admin-avatar">
                        {user?.name?.charAt(0).toUpperCase()}
                    </div>
                </div>
            </div>

            <div className="welcome-card admin-welcome-card">
                <div>
                    <span className="welcome-tag">ADMIN CONTROL CENTER</span>
                    <h1>Welcome back, {user?.name}!</h1>
                    <p>
                        You have full administrative oversight. Manage user accounts,
                        security roles, and platform permissions seamlessly.
                    </p>
                </div>

                <div className="welcome-icon">
                    <Shield size={65} />
                </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="stats-grid">
                {stats.map((item, index) => {
                    const Icon = item.icon;
                    return (
                        <div className={`stat-card ${item.color}`} key={index}>
                            <div className="stat-icon">
                                <Icon size={22} />
                            </div>
                            <p>{item.title}</p>
                            <h3>{item.value}</h3>
                            <span className="stat-sub">{item.sub}</span>
                        </div>
                    );
                })}
            </div>

            <div className="content-card">
                <div className="card-header-flex">
                    <div>
                        <h3>Recent User Accounts</h3>
                        <p className="card-subtitle">
                            Latest registered users in the database
                        </p>
                    </div>

                    <Link to="/users" className="card-action-link">
                        Manage All Users <ArrowUpRight size={16} />
                    </Link>
                </div>

                {loading ? (
                    <div className="table-loading">
                        <div className="spinner"></div>
                        <span>Loading user records...</span>
                    </div>
                ) : users.length === 0 ? (
                    <div className="empty-state">No users registered yet.</div>
                ) : (
                    <div className="table-responsive">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Role</th>
                                    <th>Joined Date</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentUsers.map((u) => (
                                    <tr key={u._id}>
                                        <td>
                                            <div className="table-user-cell">
                                                <div className="avatar sm-avatar">
                                                    {u.name?.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <strong>{u.name}</strong>
                                                    <span className="table-user-email">
                                                        {u.email}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span
                                                className={`role-badge ${
                                                    u.role === "admin"
                                                        ? "role-badge-admin"
                                                        : "role-badge-user"
                                                }`}
                                            >
                                                {u.role === "admin" ? "Admin" : "User"}
                                            </span>
                                        </td>
                                        <td>
                                            {u.createdAt
                                                ? new Date(u.createdAt).toLocaleDateString(
                                                      undefined,
                                                      {
                                                          year: "numeric",
                                                          month: "short",
                                                          day: "numeric",
                                                      }
                                                  )
                                                : "—"}
                                        </td>
                                        <td>
                                            <span className="status-indicator active">
                                                Active
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
