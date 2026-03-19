import { useEffect, useRef, useState } from "react";
import { sendMessage } from "../services/chatService";
import { uploadImage } from "../services/cloudinary";

export default function MessageInput({ user }) {
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleImage = (file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    setImage(file);
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
  };

  const clearImage = () => {
    if (preview) URL.revokeObjectURL(preview);
    setImage(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSend = async () => {
    if (loading || (!text.trim() && !image)) return;

    try {
      setLoading(true);

      let imageUrl = "";
      if (image) {
        imageUrl = await uploadImage(image);
      }

      await sendMessage({
        text: text.trim(),
        imageUrl,
        senderId: user?.uid || "",
        senderName: user?.displayName || "User",
        senderPhoto: user?.photoURL || "",
      });

      setText("");
      clearImage();
    } catch (err) {
      console.error("Send failed:", err);
      alert("Failed to send message.");
    } finally {
      setLoading(false);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="input-container">
      {preview && (
        <div className="image-preview">
          <div className="preview-label">Image preview</div>
          <img src={preview} alt="preview" />
          <button className="preview-remove" onClick={clearImage} type="button">
            ✕
          </button>
        </div>
      )}

      <div className="input-box">
        <button
          className="icon-btn attach-btn"
          type="button"
          onClick={() => fileInputRef.current?.click()}
          title="Attach image"
        >
          📎
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => handleImage(e.target.files?.[0])}
        />

        <textarea
          className="message-input"
          placeholder="Write a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={onKeyDown}
          rows={1}
        />

        <button
          className="send-btn"
          onClick={handleSend}
          disabled={loading || (!text.trim() && !image)}
          type="button"
        >
          {loading ? (
            <span className="send-spinner" />
          ) : (
            <span>➤</span>
          )}
        </button>
      </div>

      <div className="input-hint">
        Press <b>Enter</b> to send, <b>Shift + Enter</b> for newline.
      </div>
    </div>
  );
}