// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// ...existing firebase config...



// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAZOcByMRKj3nA-9poVQvawMVlplR3GJJQ",
  authDomain: "react-capstone-258ab.firebaseapp.com",
  projectId: "react-capstone-258ab",
  storageBucket: "react-capstone-258ab.firebasestorage.app",
  messagingSenderId: "246793964027",
  appId: "1:246793964027:web:52af9d06d05fafa426235e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);