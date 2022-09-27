// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB-ikipelL8puMl-A66J2vjDisJ0wybiCU",
  authDomain: "realtor-clone-react-d36a5.firebaseapp.com",
  projectId: "realtor-clone-react-d36a5",
  storageBucket: "realtor-clone-react-d36a5.appspot.com",
  messagingSenderId: "1050731576014",
  appId: "1:1050731576014:web:10bc1ce5811ed8bbcdae9f",
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const db = getFirestore();
