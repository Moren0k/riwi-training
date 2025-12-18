import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { AuthService } from "../../services/auth.service";
import { useAuth } from "../../context/AuthContext";

export const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await AuthService.login({ email, password });
            login(response.token);

            // Redirect based on role
            if (response.role === "Admin") navigate("/admin/dashboard");
            else if (response.role === "Company") navigate("/company/dashboard");
            else if (response.role === "Client") navigate("/client/dashboard");
            else navigate("/");
        } catch (err: any) {
            setError(err.response?.data?.error || "Login failed. Please check your credentials.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container">
            <div className="form-card">
                <h1>Login</h1>
                <form onSubmit={handleSubmit}>
                    {error && <div className="error-message">{error}</div>}

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" disabled={loading} className="btn-primary">
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                <p className="form-footer">
                    Don't have an account? <a href="/register">Register as Client</a>
                </p>
            </div>
        </div>
    );
};
