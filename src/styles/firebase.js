// firebase
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';

let app;

if (getApps().length === 0) {
  app = initializeApp({
    apiKey: "AIzaSyBWkjss17M-YQOmeYCLKiVgiOmLmYPPY44",
    authDomain: "crds-test-dc1be.firebaseapp.com",
    projectId: "crds-test-dc1be",
    storageBucket: "crds-test-dc1be.appspot.com",
    messagingSenderId: "1038221969065",
    appId: "1:1038221969065:web:f7217fc5a9a2938b364bb8",
    measurementId: "G-VTZCLKWHQ9"
  });
} else {
  app = getApp(); // すでに初期化されている場合、既存のアプリを取得する
}

const firestore = getFirestore(app);

if (typeof window !== 'undefined') {
  const analytics = getAnalytics(app);
}

export { firestore };