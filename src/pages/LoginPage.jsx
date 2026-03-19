import { useState } from "react";
import { loginWithGoogle } from "../services/authService";

export default function LoginPage({ onLogin }) {
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      const user = await loginWithGoogle();
      if (user) onLogin(user);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-screen">
      <div className="login-card">
        <div className="login-badge">Realtime Chat</div>

        <div className="login-hero">
          <div className="login-icon">💬</div>
          <h1>Connect instantly with your people</h1>
          <p>
            A modern chat experience with smooth messaging, image sharing,
            and secure Google login.
          </p>
        </div>

        <div className="login-features">
          <div className="feature-item">
            <span>⚡</span>
            <p>Fast real-time messaging</p>
          </div>
          <div className="feature-item">
            <span>🖼️</span>
            <p>Send images instantly</p>
          </div>
          <div className="feature-item">
            <span>🔒</span>
            <p>Secure authentication</p>
          </div>
        </div>

        <button
          className="google-btn"
          onClick={handleGoogleLogin}
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="send-spinner" /> Signing in...
            </>
          ) : (
            <>
              <span className="google-dot" /> Continue with Google
            </>
          )}
        </button>
      </div>
    </div>
  );
}