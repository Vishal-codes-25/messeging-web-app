import { useEffect, useMemo, useState } from "react";
import ChatWindow from "../components/ChatWindow";
import MessageInput from "../components/MessageInput";
import LoginPage from "./LoginPage";

import { listenMessages } from "../services/chatService";
import { logoutUser } from "../services/authService";

import { auth } from "../services/firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState(undefined);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u || null);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
    return listenMessages(setMessages);
  }, [user]);

  const displayName = useMemo(
    () => user?.displayName || "User",
    [user]
  );

  const handleLogout = async () => {
    await logoutUser();
    setUser(null);
  };

  if (user === undefined) {
    return (
      <div className="loading-screen">
        <div className="loading-card">
          <div className="spinner" />
          <h2>Loading chat...</h2>
          <p>Preparing your secure conversation space.</p>
        </div>
      </div>
    );
  }

  if (user === null) {
    return <LoginPage onLogin={setUser} />;
  }

  return (
    <div className="chat-app-shell">
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-top">
          <div className="profile-card">
            <div className="profile-avatar-wrap">
              <img
                src={
                  user.photoURL ||
                  `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                    displayName
                  )}&backgroundColor=0f172a,1d4ed8,0ea5e9,14b8a6&radius=50`
                }
                alt="profile"
                className="profile-pic"
              />
              <span className="online-badge" />
            </div>

            <div className="profile-info">
              <h3>{displayName}</h3>
              <p>{user.email || "Signed in with Google"}</p>
            </div>
          </div>

          <div className="sidebar-stats">
            <div className="stat-card">
              <span className="stat-value">{messages.length}</span>
              <span className="stat-label">Messages</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">Live</span>
              <span className="stat-label">Status</span>
            </div>
          </div>
        </div>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </aside>

      <main className="chat-section">
        <header className="chat-header">
          <button
            className="mobile-menu-btn"
            onClick={() => setSidebarOpen((prev) => !prev)}
            type="button"
          >
            ☰
          </button>

          <div className="chat-header-info">
            <h2>Chat Room</h2>
            <p>Secure, modern, real-time messaging</p>
          </div>

          <div className="chat-header-badge">
            <span className="pulse-dot" />
            Online
          </div>
        </header>

        <ChatWindow messages={messages} currentUser={user} />

        <MessageInput user={user} />
      </main>
    </div>
  );
}