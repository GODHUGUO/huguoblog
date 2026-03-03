import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAbe-qOqsCYTWI9hzuaYocJ8o78SRpCUPM",
  authDomain: "huguoblog.firebaseapp.com",
  projectId: "huguoblog",
  storageBucket: "huguoblog.firebasestorage.app",
  messagingSenderId: "316768184904",
  appId: "1:316768184904:web:630bff03c696aee5ef067d",
  measurementId: "G-8PSRNB0FFX"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app); // 👈 inchangé, vos imports ailleurs fonctionnent toujours

// 👇 juste ça en plus pour le middleware
export default defineNuxtPlugin(() => {
  return {
    provide: { auth }
  };
});