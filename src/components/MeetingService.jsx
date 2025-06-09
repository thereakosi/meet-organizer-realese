// src/services/MeetingService.js
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export const addMeeting = async (meeting) => {
  const docRef = await addDoc(collection(db, "meetings"), meeting);
  return docRef.id;
};

export const getMeetings = async () => {
  const querySnapshot = await getDocs(collection(db, "meetings"));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};
