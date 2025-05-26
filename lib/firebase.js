import { initializeApp, getApps, getApp } from 'firebase/app';

const firebaseConfig = {
    apiKey: "AIzaSyAjoIyoDwGIEQjGY7xhN38uARgdgvZ-MGY",
    authDomain: "hydrateme-2025.firebaseapp.com",
    projectId: "hydrateme-2025",
    storageBucket: "hydrateme-2025.firebasestorage.app",
    messagingSenderId: "842344742051",
    appId: "1:842344742051:web:d4110dadbea85e9f919316",
    measurementId: "G-7DPE2S4YS2"
  };
  
  const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();


export { app };

