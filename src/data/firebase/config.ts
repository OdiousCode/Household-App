import "firebase/compat/auth";
import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

export const firebaseConfig = {
  apiKey: "AIzaSyC1u9K7cEiRiOiOpeTknOZHE_gDPVfQd40",
  authDomain: "group4-ddc4f.firebaseapp.com",
  projectId: "group4-ddc4f",
  storageBucket: "group4-ddc4f.appspot.com",
  messagingSenderId: "971823808315",
  appId: "1:971823808315:web:5286fb43c276ea8396411e",
  databaseURL:
    "https://bankvalvet-97cac-default-rtdb.europe-west1.firebasedatabase.app",
};

initializeApp(firebaseConfig);
export const auth = getAuth();
export const database = initializeApp(firebaseConfig);
