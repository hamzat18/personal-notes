import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

const notesCollection = collection(db, "notes");

export async function createNote(noteData, userId) {
  await addDoc(notesCollection, {
    title: noteData.title,
    content: noteData.content,
    favorite: false,
    userId: userId,
    createdAt: serverTimestamp(),
  });
}

export function subscribeToNotes(userId, callback, onError) {
  const q = query(notesCollection, where("userId", "==", userId));
  return onSnapshot(
    q,
    (snapshot) => {
      const notes = snapshot.docs.map((document) => ({
        id: document.id,
        ...document.data(),
      }));
      callback(notes);
    },
    onError,
  );
}

export async function updateNote(noteId, updates) {
  const noteRef = doc(db, "notes", noteId);

  await updateDoc(noteRef, updates);
}

export async function removeNote(noteId) {
  const noteRef = doc(db, "notes", noteId);

  await deleteDoc(noteRef);
}
