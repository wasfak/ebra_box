import { initializeApp } from "firebase/app";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA47iKx3NTdG-cZkBHD5ogyIdG5U84WaSY",
  authDomain: "stripe-test-2-372e2.firebaseapp.com",
  projectId: "stripe-test-2-372e2",
  storageBucket: "stripe-test-2-372e2.appspot.com",
  messagingSenderId: "923965670950",
  appId: "1:923965670950:web:85db643dd689f8b3fc88e7",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const initFirebase = () => {
  return app;
};
