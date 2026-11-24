import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LockKeyhole, Mail, ArrowRight } from "lucide-react";
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
                err.response?.data?.message || "Login failed"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">

                <div className="brand">
                    <div className="brand-icon">A</div>
                    <span>AccountHub</span>
                </div>

                <div className="auth-heading">
                    <h1>Welcome back</h1>
                    <p>Enter your details to access your account.</p>
                </div>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit}>

                    <label>Email Address</label>

                    <div className="input-wrapper">
                        <Mail size={18} />
                        <input
                            type="email"
                            name="email"
                            placeholder="john@example.com"
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
                            placeholder="Enter your password"
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
                        {loading ? "Signing in..." : "Sign In"}
                        <ArrowRight size={18} />
                    </button>

                </form>

                <p className="auth-footer">
                    Don't have an account?
                    <Link to="/register"> Create account</Link>
                </p>

            </div>
        </div>
    );
};

export default Login;