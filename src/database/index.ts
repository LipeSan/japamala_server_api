import admin from 'firebase-admin';
import firebase from 'firebase';

//Set Firebase

const serviceAccountAdmin = require('../config/firebase-adminsdk.json');
const serviceAccountFirebase = require('../config/firebase-sdk.json');
firebase.initializeApp(serviceAccountFirebase);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccountAdmin),
    databaseURL: 'https://japamala-297104-default-rtdb.firebaseio.com/'
});

export default {firebase, admin};
