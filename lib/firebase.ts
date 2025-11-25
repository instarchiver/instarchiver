// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyD9WPqm1TeDFFZJtlGJqM_sgiaDQRtJAKU',
  authDomain: 'instarchiver.firebaseapp.com',
  projectId: 'instarchiver',
  storageBucket: 'instarchiver.firebasestorage.app',
  messagingSenderId: '162052642058',
  appId: '1:162052642058:web:3ce745f9502a943a6416f3',
  measurementId: 'G-PQJH839F0H',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { app, analytics, auth, provider, signInWithPopup };
