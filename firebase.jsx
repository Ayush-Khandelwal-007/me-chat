import firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyAKsXMxsteMl9w0pyCHFjFyITXy33bm9D8",
    authDomain: "me-chat-d50c5.firebaseapp.com",
    projectId: "me-chat-d50c5",
    storageBucket: "me-chat-d50c5.appspot.com",
    messagingSenderId: "665014334869",
    appId: "1:665014334869:web:9865370be7346107daf29c"
};

const app = !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();

const db = app.firestore();
const auth = app.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export { db, auth, provider };