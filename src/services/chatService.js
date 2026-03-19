import { db } from "./firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";

const messagesRef = collection(db, "messages");

// ✅ SEND MESSAGE
export const sendMessage = async ({ text, imageUrl, sender }) => {
  try {
    if (!text && !imageUrl) return;

    await addDoc(messagesRef, {
      text: text || "",
      imageUrl: imageUrl || "",
      sender,
      timestamp: serverTimestamp(),
    });
  } catch (err) {
    console.error("Error sending message:", err);
  }
};

// ✅ LISTEN MESSAGES
export const listenMessages = (callback) => {
  const q = query(messagesRef, orderBy("timestamp", "asc"));

  return onSnapshot(q, (snapshot) => {
    const msgs = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    callback(msgs);
  });
};