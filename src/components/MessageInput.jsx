import { useState } from "react";
import { sendMessage } from "../services/chatService";
import { uploadImage } from "../services/cloudinary";

export default function MessageInput({ username }) {
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImage = (file) => {
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSend = async () => {
    if (loading || (!text.trim() && !image)) return;

    setLoading(true);

    let imageUrl = "";
    if (image) {
      imageUrl = await uploadImage(image);
    }

    await sendMessage({
      text: text.trim(),
      imageUrl,
      sender: username,
    });

    setText("");
    setImage(null);
    setPreview(null);
    setLoading(false);
  };

  return (
    <div className="input-container">

      {preview && (
        <div className="image-preview">
          <img src={preview} />
          <button onClick={() => setPreview(null)}>✕</button>
        </div>
      )}

      <div className="input-box">
        <input
          type="text"
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />

        <label className="file-btn">
          📎
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => handleImage(e.target.files[0])}
          />
        </label>

        <button onClick={handleSend} disabled={loading}>
          {loading ? "..." : "➤"}
        </button>
      </div>
    </div>
  );
}