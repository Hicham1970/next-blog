// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain:process.env.NEXT_PUBLIC_AUTHDOMAIN,
    projectId: "next-blog-c6bf8",
    storageBucket: "next-blog-c6bf8.firebasestorage.app",
    messagingSenderId: "7828039539",
    appId: "1:7828039539:web:0e989f07999a0e25d04706"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

