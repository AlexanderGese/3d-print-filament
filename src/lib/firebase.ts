import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyBnqlle5SUdNQnscmvG3-h4kf2RObKZkyI",
  authDomain: "webb-36f5e.firebaseapp.com",
  databaseURL: "https://webb-36f5e-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "webb-36f5e",
  storageBucket: "webb-36f5e.firebasestorage.app",
  messagingSenderId: "201481612439",
  appId: "1:201481612439:web:f7622ef0ca9e8db3384dd2"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);