import firebase from 'firebase';
import 'firebase/firestore';
import 'firebase/storage';
import 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyAjvYfeK1RTCtdzNYSZeRcmn5MI9Iw9Tz8",
    authDomain: "instagram-clone-cd10e.firebaseapp.com",
    projectId: "instagram-clone-cd10e",
    storageBucket: "instagram-clone-cd10e.appspot.com",
    messagingSenderId: "410390554462",
    appId: "1:410390554462:web:c6a45539adb27f1f4c11cf",
    measurementId: "G-9Y29LD0TW2"
};

let app;

if (firebase.apps.length === 0) {
    app = firebase.initializeApp(firebaseConfig);
} else {
    app = firebase.app()
}

const db = app.firestore();
const storage = app.storage();
const auth = firebase.auth();

export { db, auth, storage };