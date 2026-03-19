import { useEffect, useState } from "react";

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

  // 🔐 Auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

  // 💬 Messages listener
  useEffect(() => {
    if (!user) return;
    return listenMessages(setMessages);
  }, [user]);

  // 🔄 Loading
  if (user === undefined) {
    return (
      <div style={{ color: "white", padding: "20px" }}>
        Loading...
      </div>
    );
  }

  // 🔐 Not logged in
  if (user === null) {
    return <LoginPage onLogin={setUser} />;
  }

  // ✅ MAIN UI
  return (
    <div className="app-layout">

      {/* 🔥 SIDEBAR */}
      <div className="sidebar">
        <img
          src={user.photoURL || "https://via.placeholder.com/80"}
          alt="profile"
          className="profile-pic"
        />

        <h3 className="username">{user.displayName || "User"}</h3>
        <p className="status">● Online</p>

        <button className="logout-btn" onClick={logoutUser}>
          Logout
        </button>
      </div>

      {/* 🔥 CHAT AREA */}
      <div className="chat-section">

        {/* HEADER */}
        <div className="chat-header">
          <h2>Chat Room</h2>
        </div>

        {/* MESSAGES */}
        <ChatWindow
          messages={messages}
          currentUser={user.displayName || "User"}
        />

        {/* INPUT */}
        <MessageInput username={user.displayName || "User"} />

      </div>
    </div>
  );
}