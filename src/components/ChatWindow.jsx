import { useEffect, useRef } from "react";
import Message from "./Message";

export default function ChatWindow({ messages, currentUser }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="chat-window">
      <div className="messages">
        {messages.map((msg) => (
          <Message key={msg.id} msg={msg} currentUser={currentUser} />
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}