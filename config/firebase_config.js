// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDxtjoPSU20Hv-MagKevJFaOxok2syi2mg",
  authDomain: "wipg5-d88b1.firebaseapp.com",
  projectId: "wipg5-d88b1",
  storageBucket: "wipg5-d88b1.appspot.com",
  messagingSenderId: "278395661546",
  appId: "1:278395661546:web:62928da2d76e818b3e3b93",
  measurementId: "G-BX3VB7P9J1"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app); 
export const storage = getStorage(app);
//const analytics = getAnalytics(app);