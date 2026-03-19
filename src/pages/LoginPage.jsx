import { useState } from "react";
import { loginWithGoogle } from "../services/authService";

export default function LoginPage({ onLogin }) {
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setLoading(true);
    const user = await loginWithGoogle();
    setLoading(false);

    if (user) {
      onLogin(user);
    }
  };

  return (
    <div className="login">
      <div className="login-box">
        <h1 className="app-title">💬 Chat App</h1>
        <p className="subtitle">Connect instantly with friends</p>

        <button
          className="google-btn"
          onClick={handleGoogleLogin}
          disabled={loading}
        >
          {loading ? "Signing in..." : "Continue with Google"}
        </button>
      </div>
    </div>
  );
}