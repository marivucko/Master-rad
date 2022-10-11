import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBZip1sb1TAwgJrjiHOyNpXOiT6ZmF_vlY",
  authDomain: "master-app-2deed.firebaseapp.com",
  projectId: "master-app-2deed",
  storageBucket: "master-app-2deed.appspot.com",
  messagingSenderId: "449279922576",
  appId: "1:449279922576:web:13c96e76ac5b9e0df0a315",
  measurementId: "G-Q68WWK30YK",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
