import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBhpFywiDrUz4Bw2FVheQAk3AgiwgRTCjY",
  authDomain: "jaipur-esports-club-8ed51.firebaseapp.com",
  projectId: "jaipur-esports-club-8ed51",
  storageBucket: "jaipur-esports-club-8ed51.firebasestorage.app",
  messagingSenderId: "437610803290",
  appId: "1:437610803290:web:0f566f18d3d0a547756863",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
  
export default app;