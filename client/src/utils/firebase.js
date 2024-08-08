// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { GoogleAuthProvider, getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCgRovWt8TEmI59K5apa-RBqE_xtYAIZQs",
  authDomain: "video-668ec.firebaseapp.com",
  projectId: "video-668ec",
  storageBucket: "video-668ec.appspot.com",
  messagingSenderId: "826638811283",
  appId: "1:826638811283:web:c5823880c0a5b6c1ef0d66",
  measurementId: "G-NF2EQY709R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth();
export const provider = new GoogleAuthProvider()

export default app;