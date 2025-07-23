// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDGz80fgeQ6082VFyIVywzbMXCPhWa7Hc0",
    authDomain: "capstone-main-f8e01.firebaseapp.com",
    projectId: "capstone-main-f8e01",
    storageBucket: "capstone-main-f8e01.firebasestorage.app",
    messagingSenderId: "454666934716",
    appId: "1:454666934716:web:b05e612a9418f8f849f3b9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app; 