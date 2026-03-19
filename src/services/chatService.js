import { db } from "./firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  limit,
} from "firebase/firestore";

const messagesRef = collection(db, "messages");

export const sendMessage = async ({
  text,
  imageUrl,
  senderId,
  senderName,
  senderPhoto,
}) => {
  try {
    if (!text && !imageUrl) return;

    await addDoc(messagesRef, {
      text: text || "",
      imageUrl: imageUrl || "",
      senderId: senderId || "",
      senderName: senderName || "User",
      senderPhoto: senderPhoto || "",
      timestamp: serverTimestamp(),
    });
  } catch (err) {
    console.error("Error sending message:", err);
  }
};

export const listenMessages = (callback) => {
  const q = query(messagesRef, orderBy("timestamp", "asc"), limit(200));

  return onSnapshot(q, (snapshot) => {
    const msgs = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    callback(msgs);
  });
};