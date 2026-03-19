import React from "react";
export default function Message({ msg, currentUser }) {
  if (!msg) return null;

  const isMe = msg.sender === currentUser;

  const time = msg?.timestamp?.seconds
    ? new Date(msg.timestamp.seconds * 1000).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  return (
    <div className={`message-row ${isMe ? "me" : "other"}`}>
      
      {!isMe && msg.sender && (
        <img
          src={`https://api.dicebear.com/7.x/initials/svg?seed=${msg.sender}&size=36`}
          className="avatar"
          width="36"
          height="36"
          alt="avatar"
        />
      )}

      <div className="message">
        {!isMe && <div className="sender">{msg.sender}</div>}

        {msg.text && <div className="text">{msg.text}</div>}

        {msg.imageUrl && (
          <img
            className="chat-image"
            src={msg.imageUrl}
            alt="chat"
          />
        )}

        {time && <div className="time">{time}</div>}
      </div>
    </div>
  );
}