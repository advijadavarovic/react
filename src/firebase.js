import {initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBJL4QweHNsHzFk6iDh0GqPhCjrhzUc97A",
    authDomain: "serapion-flights-scanner-14d60.firebaseapp.com",
    projectId: "serapion-flights-scanner-14d60",
    storageBucket: "serapion-flights-scanner-14d60.appspot.com",
    messagingSenderId: "386052314967",
    appId: "1:386052314967:web:4c5aa413c2ca4637add012"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
