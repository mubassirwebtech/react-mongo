import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, LockKeyhole, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Register = () => {
    const navigate = useNavigate();

    const { register } = useAuth();

    const [formData, setFormData] = useState({
        name: "",
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
            await register(formData);

            navigate("/dashboard");
        } catch (err) {
            setError(
                err.response?.data?.message || "Registration failed"
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
                    <h1>Create account</h1>
                    <p>Start your journey with us today.</p>
                </div>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit}>

                    <label>Full Name</label>

                    <div className="input-wrapper">
                        <User size={18} />
                        <input
                            type="text"
                            name="name"
                            placeholder="John Smith"
                            value={formData.name}
                            onChange={handleChange}
                            minLength={2}
                            maxLength={50}
                            required
                        />
                    </div>

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
                            placeholder="Minimum 8 characters"
                            value={formData.password}
                            onChange={handleChange}
                            minLength={8}
                            required
                        />
                    </div>

                    <button
                        className="primary-btn"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? "Creating account..." : "Create Account"}
                        <ArrowRight size={18} />
                    </button>

                </form>

                <p className="auth-footer">
                    Already have an account?
                    <Link to="/login"> Sign in</Link>
                </p>

            </div>
        </div>
    );
};

export default Register;