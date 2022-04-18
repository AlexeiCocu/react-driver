import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore'

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCW1So9sWkUrBYuZF7Z1uUDqAMFX1uRh_g",
    authDomain: "geo-driver-343413.firebaseapp.com",
    projectId: "geo-driver-343413",
    storageBucket: "geo-driver-343413.appspot.com",
    messagingSenderId: "333376738528",
    appId: "1:333376738528:web:276dcb4bb36fef6fa96c85"
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const db = getFirestore();