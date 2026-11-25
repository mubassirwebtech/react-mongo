import { useEffect, useState } from "react";
import {
    UserRound,
    Mail,
    Save,
    Shield,
    Lock,
    KeyRound,
    CheckCircle2,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

const Profile = () => {
    const { user, updateProfile, changePassword } = useAuth();

    // Profile form
    const [name, setName] = useState(user?.name || "");
    const [profileMessage, setProfileMessage] = useState("");
    const [profileError, setProfileError] = useState("");
    const [profileLoading, setProfileLoading] = useState(false);

    // Password form
    const [passwords, setPasswords] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [passwordMessage, setPasswordMessage] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [passwordLoading, setPasswordLoading] = useState(false);

    useEffect(() => {
        setName(user?.name || "");
    }, [user]);

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setProfileMessage("");
        setProfileError("");
        setProfileLoading(true);

        try {
            await updateProfile({ name });
            setProfileMessage("Administrator profile updated successfully!");
        } catch (err) {
            setProfileError(
                err.response?.data?.message || "Failed to update profile"
            );
        } finally {
            setProfileLoading(false);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setPasswordMessage("");
        setPasswordError("");

        if (passwords.newPassword.length < 8) {
            setPasswordError("New password must be at least 8 characters");
            return;
        }

        if (passwords.newPassword !== passwords.confirmPassword) {
            setPasswordError("New passwords do not match");
            return;
        }

        setPasswordLoading(true);

        try {
            await changePassword({
                currentPassword: passwords.currentPassword,
                newPassword: passwords.newPassword,
            });
            setPasswordMessage(
                "Password changed successfully! Please log in again."
            );
            setPasswords({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            });
        } catch (err) {
            setPasswordError(
                err.response?.data?.message || "Failed to change password"
            );
        } finally {
            setPasswordLoading(false);
        }
    };

    return (
        <div className="page-content">
            <div className="topbar">
                <div>
                    <span className="breadcrumb">Pages / Account</span>
                    <h2>Admin Profile & Security</h2>
                </div>
            </div>

            <div className="profile-container-grid">
                {/* Profile Information */}
                <div className="profile-card">
                    <div className="profile-header">
                        <div className="profile-avatar admin-avatar">
                            {user?.name?.charAt(0).toUpperCase()}
                        </div>

                        <div>
                            <h2>{user?.name}</h2>
                            <p>{user?.email}</p>
                            <span className="role-tag">
                                <Shield size={12} /> System Administrator
                            </span>
                        </div>
                    </div>

                    <div className="profile-divider"></div>

                    <h3>Administrator Information</h3>

                    {profileMessage && (
                        <div className="success-message">{profileMessage}</div>
                    )}

                    {profileError && (
                        <div className="error-message">{profileError}</div>
                    )}

                    <form onSubmit={handleProfileSubmit}>
                        <label>Admin Full Name</label>
                        <div className="input-wrapper">
                            <UserRound size={18} />
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                minLength={2}
                                maxLength={50}
                                required
                            />
                        </div>

                        <label>Email Address</label>
                        <div className="input-wrapper disabled-input">
                            <Mail size={18} />
                            <input
                                type="email"
                                value={user?.email || ""}
                                disabled
                            />
                        </div>

                        <label>System Role</label>
                        <div className="input-wrapper disabled-input">
                            <Shield size={18} />
                            <input
                                type="text"
                                value="Administrator (Superuser)"
                                disabled
                            />
                        </div>

                        <button
                            type="submit"
                            className="primary-btn profile-save"
                            disabled={profileLoading}
                        >
                            <Save size={18} />
                            {profileLoading ? "Saving..." : "Save Changes"}
                        </button>
                    </form>
                </div>

                {/* Password & Security Card */}
                <div className="profile-card">
                    <div className="profile-card-header">
                        <div className="icon-header-badge">
                            <KeyRound size={20} />
                        </div>
                        <div>
                            <h3>Change Admin Password</h3>
                            <p className="card-subtitle">
                                Ensure your admin account is protected by a strong password
                            </p>
                        </div>
                    </div>

                    <div className="profile-divider"></div>

                    {passwordMessage && (
                        <div className="success-message">{passwordMessage}</div>
                    )}

                    {passwordError && (
                        <div className="error-message">{passwordError}</div>
                    )}

                    <form onSubmit={handlePasswordSubmit}>
                        <label>Current Password</label>
                        <div className="input-wrapper">
                            <Lock size={18} />
                            <input
                                type="password"
                                placeholder="Enter current password"
                                value={passwords.currentPassword}
                                onChange={(e) =>
                                    setPasswords({
                                        ...passwords,
                                        currentPassword: e.target.value,
                                    })
                                }
                                required
                            />
                        </div>

                        <label>New Password (min 8 characters)</label>
                        <div className="input-wrapper">
                            <Lock size={18} />
                            <input
                                type="password"
                                placeholder="Enter new strong password"
                                value={passwords.newPassword}
                                onChange={(e) =>
                                    setPasswords({
                                        ...passwords,
                                        newPassword: e.target.value,
                                    })
                                }
                                required
                                minLength={8}
                            />
                        </div>

                        <label>Confirm New Password</label>
                        <div className="input-wrapper">
                            <Lock size={18} />
                            <input
                                type="password"
                                placeholder="Re-type new password"
                                value={passwords.confirmPassword}
                                onChange={(e) =>
                                    setPasswords({
                                        ...passwords,
                                        confirmPassword: e.target.value,
                                    })
                                }
                                required
                                minLength={8}
                            />
                        </div>

                        <button
                            type="submit"
                            className="primary-btn profile-save"
                            disabled={passwordLoading}
                        >
                            <KeyRound size={18} />
                            {passwordLoading ? "Updating..." : "Update Password"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile;
