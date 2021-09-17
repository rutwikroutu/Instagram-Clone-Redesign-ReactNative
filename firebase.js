import firebase from 'firebase';
import 'firebase/firestore';
import 'firebase/storage';
import 'firebase/auth';

const firebaseConfig = {
    //config
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
