import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD9WPqm1TeDFFZJtlGJqM_sgiaDQRtJAKU",
  authDomain: "instarchiver.firebaseapp.com",
  projectId: "instarchiver",
  storageBucket: "instarchiver.firebasestorage.app",
  messagingSenderId: "162052642058",
  appId: "1:162052642058:web:3ce745f9502a943a6416f3",
  measurementId: "G-PQJH839F0H",
};

function getFirebaseApp() {
  return getApps().length ? getApp() : initializeApp(firebaseConfig);
}

export function getFirebaseAuth() {
  return getAuth(getFirebaseApp());
}

export function createGoogleProvider() {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });
  return provider;
}
