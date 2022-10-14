import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { Household, Profile, User, Task, TaskHistory } from "../APItypes";

const firebaseConfig = {
    apiKey: "AIzaSyC1u9K7cEiRiOiOpeTknOZHE_gDPVfQd40",
    authDomain: "group4-ddc4f.firebaseapp.com",
    projectId: "group4-ddc4f",
    storageBucket: "group4-ddc4f.appspot.com",
    messagingSenderId: "971823808315",
    appId: "1:971823808315:web:5286fb43c276ea8396411e",
    measurementId: "G-QDT6SM4R84"
  };

  const app = firebase.initializeApp(firebaseConfig);