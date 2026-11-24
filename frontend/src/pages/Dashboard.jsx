import {
    UserRound,
    ShieldCheck,
    CalendarDays,
    Activity,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
    const { user } = useAuth();

    const stats = [
        {
            title: "Account Status",
            value: "Active",
            icon: ShieldCheck,
        },
        {
            title: "User Role",
            value: user?.role || "User",
            icon: UserRound,
        },
        {
            title: "Member Since",
            value: user?.createdAt
                ? new Date(user.createdAt).toLocaleDateString()
                : "Registered",
            icon: CalendarDays,
        },
        {
            title: "Authentication",
            value: "Verified",
            icon: Activity,
        },
    ];

    return (
        <div className="page-content">

            <div className="topbar">
                <div>
                    <span className="breadcrumb">Pages / Dashboard</span>
                    <h2>Dashboard</h2>
                </div>

                <div className="topbar-avatar">
                    {user?.name?.charAt(0).toUpperCase()}
                </div>
            </div>

            <div className="welcome-card">
                <div>
                    <span className="welcome-tag">YOUR WORKSPACE</span>
                    <h1>Welcome back, {user?.name}!</h1>
                    <p>
                        Your account is ready. Manage your profile
                        and account settings from here.
                    </p>
                </div>

                <div className="welcome-icon">
                    <Activity size={60} />
                </div>
            </div>

            <div className="stats-grid">

                {stats.map((item, index) => {
                    const Icon = item.icon;

                    return (
                        <div className="stat-card" key={index}>
                            <div className="stat-icon">
                                <Icon size={22} />
                            </div>

                            <p>{item.title}</p>
                            <h3>{item.value}</h3>
                        </div>
                    );
                })}

            </div>

            <div className="content-card">
                <h3>Account Information</h3>

                <div className="info-row">
                    <span>Full Name</span>
                    <strong>{user?.name}</strong>
                </div>

                <div className="info-row">
                    <span>Email Address</span>
                    <strong>{user?.email}</strong>
                </div>

                <div className="info-row">
                    <span>Account Role</span>
                    <strong>{user?.role}</strong>
                </div>

            </div>

        </div>
    );
};

export default Dashboard;