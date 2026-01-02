// ================== FIREBASE ==================
import { initializeApp, getApps, getApp } 
from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  updatePassword,
  signOut
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// 🔴 WAJIB SAMA PERSIS DENGAN HALAMAN LAIN
const firebaseConfig = {
  apiKey: "AIzaSyAo4Hed-LHh2YIdkOE9PEinMGjG9UwAMUQ",
  authDomain: "tarbiyyat-lughah-presence.firebaseapp.com",
  projectId: "tarbiyyat-lughah-presence",
  storageBucket: "tarbiyyat-lughah-presence.firebasestorage.app",
  messagingSenderId: "543639208143",
  appId: "1:543639208143:web:4456bc9abff95559f277ba"
};

// =============================================


const app = getApps().length === 0
  ? initializeApp(firebaseConfig)
  : getApp();
const auth = getAuth(app);
const db   = getFirestore(app);

// ================== ELEMENT ==================
const inputPassword = document.getElementById("newPassword");
const btnSave       = document.getElementById("btnSave");

// ================== AUTH CHECK ==================
onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "dashboard-siswa.html";
  }
});

// ================== SIMPAN PASSWORD ==================
btnSave.addEventListener("click", async () => {
  const newPassword = inputPassword.value.trim();

  if (newPassword.length < 6) {
    alert("Password minimal 6 karakter");
    return;
  }

  const user = auth.currentUser;
  if (!user) return;

  try {
    // 1️⃣ UPDATE PASSWORD AUTH
    await updatePassword(user, newPassword);

    // 2️⃣ UPDATE FIRESTORE
    await updateDoc(doc(db, "users", user.uid), {
      mustChangePassword: false
    });

    alert("Password berhasil diganti. Silakan login ulang.");

    // 3️⃣ LOGOUT PAKSA
    await signOut(auth);
    window.location.href = "dashboard-siswa.html";

  } catch (err) {
    console.error(err);
    alert("Gagal mengganti password: " + err.message);
  }
});
