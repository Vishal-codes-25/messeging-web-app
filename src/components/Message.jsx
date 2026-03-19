import React from "react";

export default function Message({ msg, currentUser }) {
  if (!msg) return null;

  const currentUid = currentUser?.uid || "";
  const currentName = currentUser?.displayName || "User";

  const isMe = msg.senderId
    ? msg.senderId === currentUid
    : msg.sender === currentName;

  const time = msg?.timestamp?.seconds
    ? new Date(msg.timestamp.seconds * 1000).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  const avatarSeed =
    msg.senderName || msg.sender || msg.senderId || "User";

  return (
    <div className={`message-row ${isMe ? "me" : "other"}`}>
      {!isMe && (
        <img
          src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
            avatarSeed
          )}&backgroundColor=0f172a,1d4ed8,0ea5e9,14b8a6&radius=50`}
          className="avatar"
          width="38"
          height="38"
          alt="avatar"
        />
      )}

      <div className={`message-bubble ${isMe ? "me" : "other"}`}>
        {!isMe && (
          <div className="sender-name">{msg.senderName || msg.sender}</div>
        )}

        {msg.text && <div className="message-text">{msg.text}</div>}

        {msg.imageUrl && (
          <a href={msg.imageUrl} target="_blank" rel="noreferrer">
            <img className="chat-image" src={msg.imageUrl} alt="chat upload" />
          </a>
        )}

        <div className="message-meta">
          <span className="message-time">{time}</span>
          {isMe && <span className="read-dot">Sent</span>}
        </div>
      </div>

      {isMe && (
        <img
          src={
            currentUser?.photoURL ||
            `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
              currentName
            )}&backgroundColor=0f172a,1d4ed8,0ea5e9,14b8a6&radius=50`
          }
          className="avatar"
          width="38"
          height="38"
          alt="avatar"
        />
      )}
    </div>
  );
}