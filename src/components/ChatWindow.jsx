import { useEffect, useRef } from "react";
import Message from "./Message";

export default function ChatWindow({ messages = [], currentUser }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  return (
    <div className="chat-window">
      <div className="messages">
        {messages.length === 0 ? (
          <div className="empty-chat">
            <div className="empty-chat-icon">💬</div>
            <h3>No messages yet</h3>
            <p>Start the conversation by sending your first message.</p>
          </div>
        ) : (
          messages.map((msg) => (
            <Message key={msg.id} msg={msg} currentUser={currentUser} />
          ))
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}