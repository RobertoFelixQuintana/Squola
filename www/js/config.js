/* - - - - - - - - - - - - - - - - - 
   Configurations for the Firebase
- - - - - - - - - - - - - - - - - - -  */

// Firebase Configuration and Initialization
const firebaseConfig = {
  apiKey: "AIzaSyDXPLdqL98BsBPOGwnU9kO7_gvUjTjn5VA",
  authDomain: "reactfirebase-c1dc0.firebaseapp.com",
  databaseURL: "https://reactfirebase-c1dc0-default-rtdb.firebaseio.com/",
  projectId: "reactfirebase-c1dc0",
  storageBucket: "reactfirebase-c1dc0.appspot.com",
  messagingSenderId: "266100355290",
  appId: "1:266100355290:web:27527b838628fa6f69b5e3",
  measurementId: "G-3TFNCVKG48"
};
firebase.initializeApp(firebaseConfig);

// Make Auth and Firestore References
const auth = firebase.auth();
const db = firebase.firestore();