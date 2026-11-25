import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LockKeyhole, Mail, ArrowRight, ShieldCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            await login(formData);
            navigate("/dashboard");
        } catch (err) {
            setError(
                err.response?.data?.message ||
                err.message ||
                "Admin authentication failed"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="brand">
                    <div className="brand-icon admin-brand-icon">
                        <ShieldCheck size={22} />
                    </div>
                    <div>
                        <span>AdminHub</span>
                        <span className="brand-badge">ADMIN PORTAL</span>
                    </div>
                </div>

                <div className="auth-heading">
                    <h1>Administrator Access</h1>
                    <p>Enter your administrator credentials to manage the platform.</p>
                </div>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <label>Admin Email</label>
                    <div className="input-wrapper">
                        <Mail size={18} />
                        <input
                            type="email"
                            name="email"
                            placeholder="admin@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <label>Password</label>
                    <div className="input-wrapper">
                        <LockKeyhole size={18} />
                        <input
                            type="password"
                            name="password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button
                        className="primary-btn"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? "Authenticating..." : "Enter Admin Panel"}
                        <ArrowRight size={18} />
                    </button>
                </form>

                <div className="admin-login-notice">
                    <p>Only accounts with <strong>admin</strong> privileges can access this panel.</p>
                </div>
            </div>
        </div>
    );
};

export default Login;
