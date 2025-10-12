// ===== presence.js (global, konsisten lintas-tab) =====

// Firebase config (punyamu)
const firebaseConfig = {
  apiKey: "AIzaSyAo4Hed-LHh2YIdkOE9PEinMGjG9UwAMUQ",
  authDomain: "tarbiyyat-lughah-presence.firebaseapp.com",
  databaseURL: "https://tarbiyyat-lughah-presence-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "tarbiyyat-lughah-presence",
  storageBucket: "tarbiyyat-lughah-presence.appspot.com",
  appId: "1:543639208143:web:4456bc9abff95559f277ba"
};

// Parameter
const SCOPE = "all";
const HEARTBEAT_MS = 15000; // 15s
const FRESH_MS     = 30000; // 30s (2x heartbeat)

// Session per TAB (persist saat pindah halaman)
const SID_KEY = "presence_sid";
let sessionId = sessionStorage.getItem(SID_KEY);
if (!sessionId) {
  sessionId = (crypto.randomUUID && crypto.randomUUID()) || (Date.now()+"-"+Math.random().toString(16).slice(2));
  sessionStorage.setItem(SID_KEY, sessionId);
}

// Inject badge bila belum ada
if (!document.getElementById("viewer-badge")) {
  const badge = document.createElement("div");
  badge.id = "viewer-badge";
  badge.className = "fixed top-3 right-4 z-50 flex items-center gap-2 bg-yellow-100/90 px-3 py-1.5 rounded-full shadow-md font-semibold text-sm text-gray-900";
  badge.innerHTML = `👥 <span id="viewer-count">0</span> online`;
  document.addEventListener("DOMContentLoaded", () => document.body.appendChild(badge));
}

const [{ initializeApp }, { getAuth, signInAnonymously, onAuthStateChanged },
       { getDatabase, ref, set, update, onValue, serverTimestamp }]
  = await Promise.all([
    import("https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js"),
    import("https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js"),
    import("https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js"),
  ]);

const app  = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db   = getDatabase(app);
const countEl = () => document.getElementById("viewer-count");

// === 1) Gunakan waktu server untuk sinkronisasi ===
let serverOffset = 0;
onValue(ref(db, ".info/serverTimeOffset"), (snap) => {
  const off = snap.val();
  serverOffset = typeof off === "number" ? off : 0;
});
const serverNow = () => Date.now() + serverOffset;

// === util hitung fresh sessions ===
function freshCount(snap, now){
  if (!snap.exists()) return 0;
  let total = 0;
  snap.forEach(uidSnap => {
    uidSnap.forEach(sessSnap => {
      const v = sessSnap.val();
      if (v && typeof v.ts === "number" && (now - v.ts) <= FRESH_MS) total++;
    });
  });
  return total;
}

signInAnonymously(auth).catch(console.error);

onAuthStateChanged(auth, async (user) => {
  if (!user) return;
  const uid = user.uid;

  const presRef = ref(db, `presence/${SCOPE}/${uid}/${sessionId}`);

  // Tulis/overwrite node (tanpa onDisconnect.remove → hindari “dip” saat pindah halaman)
  await set(presRef, { ts: serverTimestamp(), page: location.pathname, sid: sessionId });

  // Heartbeat berkala + saat kembali fokus
  const beat = () => update(presRef, { ts: serverTimestamp(), page: location.pathname }).catch(()=>{});
  let timer = setInterval(beat, HEARTBEAT_MS);
  window.addEventListener("beforeunload", () => clearInterval(timer));
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) { clearInterval(timer); }
    else { beat(); timer = setInterval(beat, HEARTBEAT_MS); }
  });

  // === 2) Hitung hanya yang "fresh" berdasar waktu server ===
  const listRef = ref(db, `presence/${SCOPE}`);
  onValue(listRef, (snap) => {
    const now = serverNow();                 // konsisten di semua tab
    const n   = freshCount(snap, now);       // tanpa fallback
    const el  = countEl(); if (el) el.textContent = String(n);
  });
});
