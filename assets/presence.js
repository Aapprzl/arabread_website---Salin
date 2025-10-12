/* =========================
   presence.js — GLOBAL COUNTER
   ========================= */

// --- 0) Firebase config (punyamu) ---
const firebaseConfig = {
  apiKey: "AIzaSyAo4Hed-LHh2YIdkOE9PEinMGjG9UwAMUQ",
  authDomain: "tarbiyyat-lughah-presence.firebaseapp.com",
  databaseURL: "https://tarbiyyat-lughah-presence-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "tarbiyyat-lughah-presence",
  storageBucket: "tarbiyyat-lughah-presence.appspot.com",
  appId: "1:543639208143:web:4456bc9abff95559f277ba"
};

// --- 1) Parameter (disetel “cepat”) ---
const SCOPE        = "all";  // global counter untuk seluruh situs
const HEARTBEAT_MS = 8000;   // kirim beat tiap 8 dtk
const FRESH_MS     = 16000;  // dianggap online bila ts ≤ 16 dtk (≈2× heartbeat)

// --- 2) Session per TAB (persist saat pindah halaman) ---
const SID_KEY = "presence_sid";
let sessionId = sessionStorage.getItem(SID_KEY);
if (!sessionId) {
  sessionId = (crypto.randomUUID && crypto.randomUUID())
    || (`${Date.now()}-${Math.random().toString(16).slice(2)}`);
  sessionStorage.setItem(SID_KEY, sessionId);
}

// --- 3) Deteksi “navigasi internal” vs tutup TAB (smart onDisconnect) ---
const NAV_FLAG = "presence_nav_intent";
sessionStorage.removeItem(NAV_FLAG); // reset di awal load halaman

document.addEventListener("click", (e) => {
  const a = e.target.closest?.("a[href]");
  if (!a) return;
  const url = new URL(a.href, location.href);
  if (url.hostname === location.hostname) {
    sessionStorage.setItem(NAV_FLAG, "1"); // akan pindah halaman di situs yang sama
  }
});
document.addEventListener("submit", () => {
  sessionStorage.setItem(NAV_FLAG, "1");
});

// --- 4) Pastikan badge ada (aman kalau kamu sudah menaruhnya di HTML) ---
if (!document.getElementById("viewer-badge")) {
  const badge = document.createElement("div");
  badge.id = "viewer-badge";
  badge.className = "fixed top-3 right-4 z-50 flex items-center gap-2 bg-yellow-100/90 px-3 py-1.5 rounded-full shadow-md font-semibold text-sm text-gray-900";
  badge.innerHTML = `👥 <span id="viewer-count">0</span> online`;
  document.addEventListener("DOMContentLoaded", () => document.body.appendChild(badge));
}
const countEl = () => document.getElementById("viewer-count");

// --- 5) Import Firebase modular (CDN) ---
const [{ initializeApp }, { getAuth, signInAnonymously, onAuthStateChanged },
       { getDatabase, ref, set, update, onValue, serverTimestamp }]
  = await Promise.all([
    import("https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js"),
    import("https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js"),
    import("https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js"),
  ]);

// --- 6) Init & sinkron waktu server ---
const app  = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db   = getDatabase(app);

let serverOffset = 0;
onValue(ref(db, ".info/serverTimeOffset"), (snap) => {
  const off = snap.val();
  serverOffset = typeof off === "number" ? off : 0;
});
const serverNow = () => Date.now() + serverOffset;

// --- 7) Util: hitung sesi yang “fresh” (≤ FRESH_MS) ---
function freshCount(snap, now) {
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

// --- 8) Auth anonim + presence global (tanpa “drop saat pindah halaman”) ---
signInAnonymously(auth).catch(console.error);

onAuthStateChanged(auth, async (user) => {
  if (!user) return;
  const uid = user.uid;

  const presRef = ref(db, `presence/${SCOPE}/${uid}/${sessionId}`);

  // Tulis / overwrite node
  await set(presRef, { ts: serverTimestamp(), page: location.pathname, sid: sessionId });

  // Smart onDisconnect:
  // - Jika TIDAK ada niat navigasi → pasang remove (drop instan saat TAB ditutup)
  // - Jika ada niat navigasi → jangan pasang (hindari “angka turun dulu”)
  if (!sessionStorage.getItem(NAV_FLAG)) {
    try { (await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js"))
      .onDisconnect?.(presRef).remove(); } catch {}
  }

  // Heartbeat berkala + beat instan saat balik fokus
  const beat = () => update(presRef, { ts: serverTimestamp(), page: location.pathname }).catch(()=>{});
  let timer = setInterval(beat, HEARTBEAT_MS);
  window.addEventListener("beforeunload", () => clearInterval(timer));
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) { clearInterval(timer); }
    else { beat(); timer = setInterval(beat, HEARTBEAT_MS); }
  });
  window.addEventListener("focus", beat);
  window.addEventListener("pageshow", beat);

  // Subscribe total online (fresh only, sinkron waktu server)
  const listRef = ref(db, `presence/${SCOPE}`);
  onValue(listRef, (snap) => {
    const now = serverNow();
    const n = freshCount(snap, now);
    const el = countEl(); if (el) el.textContent = String(n);
  });
});