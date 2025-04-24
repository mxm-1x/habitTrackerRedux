// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAmYsZ4SLGGlwuYgPlsigVtQ9cpWasqpmw",
    authDomain: "habit-tracker-154dc.firebaseapp.com",
    projectId: "habit-tracker-154dc",
    storageBucket: "habit-tracker-154dc.firebasestorage.app",
    messagingSenderId: "602597019474",
    appId: "1:602597019474:web:7f5c317f0dd7b1468bb48b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app; 