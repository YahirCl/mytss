// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {initializeAuth, setPersistence, browserLocalPersistence} from "firebase/auth";
//import AsyncStorage from '@react-native-async-storage/async-storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDtSP_jk4hfENS3a0uKM0Yz5uKtADU-AJU",
  authDomain: "proyectts.firebaseapp.com",
  projectId: "proyectts",
  storageBucket: "proyectts.firebasestorage.app",
  messagingSenderId: "124839954668",
  appId: "1:124839954668:web:6ebbcefb03f13254e1bdc9",
  measurementId: "G-XC9LD332JM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);



// Inicializa Firebase Auth con persistencia usando AsyncStorage
export const auth = initializeAuth(app);