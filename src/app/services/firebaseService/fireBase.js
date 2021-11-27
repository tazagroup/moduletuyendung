import firebase from "firebase/app";
import "firebase/storage"
const firebaseConfig = {
    apiKey: "AIzaSyDnrPDBr5JHulQ6RfWL0O8bUs6mgHCL9do",
    authDomain: "katacoffee-ffe29.firebaseapp.com",
    databaseURL: "https://katacoffee-ffe29.firebaseio.com",
    projectId: "katacoffee-ffe29",
    storageBucket: "katacoffee-ffe29.appspot.com",
    messagingSenderId: "311514591116",
    appId: "1:311514591116:web:e3cdd0a370ebb1579070a9"
  };

firebase.initializeApp(firebaseConfig)
const storage = firebase.storage()

export { storage, firebase as default }