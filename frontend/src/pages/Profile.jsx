import { useEffect, useState } from "react";
import { UserRound, Mail, Save } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
    const { user, updateProfile } = useAuth();

    const [name, setName] = useState(user?.name || "");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setName(user?.name || "");
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");
        setLoading(true);

        try {
            await updateProfile({ name });

            setMessage("Profile updated successfully!");
        } catch (err) {
            setError(
                err.response?.data?.message || "Profile update failed"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-content">

            <div className="topbar">
                <div>
                    <span className="breadcrumb">Pages / Profile</span>
                    <h2>My Profile</h2>
                </div>
            </div>

            <div className="profile-card">

                <div className="profile-header">
                    <div className="profile-avatar">
                        {user?.name?.charAt(0).toUpperCase()}
                    </div>

                    <div>
                        <h2>{user?.name}</h2>
                        <p>{user?.email}</p>
                    </div>
                </div>

                <div className="profile-divider"></div>

                <h3>Personal Information</h3>

                {message && (
                    <div className="success-message">{message}</div>
                )}

                {error && (
                    <div className="error-message">{error}</div>
                )}

                <form onSubmit={handleSubmit}>

                    <label>Full Name</label>

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

                    <button
                        type="submit"
                        className="primary-btn profile-save"
                        disabled={loading}
                    >
                        <Save size={18} />
                        {loading ? "Saving..." : "Save Changes"}
                    </button>

                </form>

            </div>

        </div>
    );
};

export default Profile;