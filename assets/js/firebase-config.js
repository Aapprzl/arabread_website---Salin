// assets/js/firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getFirestore, collection, getDocs, query, where, orderBy } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyAo4Hed-LHh2YIdkOE9PEinMGjG9UwAMUQ",
  authDomain: "tarbiyyat-lughah-presence.firebaseapp.com",
  projectId: "tarbiyyat-lughah-presence",
  databaseURL: "https://tarbiyyat-lughah-presence-default-rtdb.asia-southeast1.firebasedatabase.app",
  storageBucket: "tarbiyyat-lughah-presence.firebasestorage.app",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const rtdb = getDatabase(app);

// Export common firestore functions for convenience
export { collection, getDocs, query, where, orderBy };
