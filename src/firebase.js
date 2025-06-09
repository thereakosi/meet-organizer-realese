// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";



const firebaseConfig = {
  apiKey: "AIzaSyB-xcG70p1nWmuRYN5THWkaOTOH5uNHx5Q",
  authDomain: "meet-organizer-dcd07.firebaseapp.com",
  projectId: "meet-organizer-dcd07",
  storageBucket: "meet-organizer-dcd07.firebasestorage.app",
  messagingSenderId: "1024905160690",
  appId: "1:1024905160690:web:1d2e5b44499f9d6a14ed6b"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);

provider.addScope("https://www.googleapis.com/auth/calendar.events");