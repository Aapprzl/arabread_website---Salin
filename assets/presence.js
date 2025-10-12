  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
  import { getAuth, signInAnonymously, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
  import { getDatabase, ref, set, update, onDisconnect, onValue, serverTimestamp }
    from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

  // === KONFIGURASI PROYEKMU ===
  const firebaseConfig = {
    apiKey: "AIzaSyAo4Hed-LHh2YIdkOE9PEinMGjG9UwAMUQ",
    authDomain: "tarbiyyat-lughah-presence.firebaseapp.com",
    databaseURL: "https://tarbiyyat-lughah-presence-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "tarbiyyat-lughah-presence",
    storageBucket: "tarbiyyat-lughah-presence.appspot.com",
    appId: "1:543639208143:web:4456bc9abff95559f277ba"
  };

  // === MODE GLOBAL (satu angka untuk seluruh situs) ===
  const SCOPE = "all";
  const HEARTBEAT_MS = 20000;  // update tiap 20 dtk
  const FRESH_MS = 35000;      // dianggap online jika heartbeat ≤ 35 dtk
  const sessionId = (crypto.randomUUID && crypto.randomUUID()) || (Date.now()+"-"+Math.random().toString(16).slice(2));

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getDatabase(app);
  const badge = document.getElementById("viewer-count");

  function countFreshSessions(snap, now){
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
  function countAllSessions(snap){
    if (!snap.exists()) return 0;
    let total = 0;
    snap.forEach(uidSnap => { total += (uidSnap.size || uidSnap.numChildren()); });
    return total;
  }

  signInAnonymously(auth).catch(console.error);
  onAuthStateChanged(auth, async (user) => {
    if (!user) return;
    const uid = user.uid;

    // presence disimpan per-tab: presence/all/<uid>/<sessionId>
    const presRef = ref(db, `presence/${SCOPE}/${uid}/${sessionId}`);
    await set(presRef, { ts: serverTimestamp(), page: location.pathname, sid: sessionId });
    onDisconnect(presRef).remove();

    // heartbeat
    const beat = () => update(presRef, { ts: serverTimestamp(), page: location.pathname }).catch(()=>{});
    let timer = setInterval(beat, HEARTBEAT_MS);
    window.addEventListener("beforeunload", () => clearInterval(timer));
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) { clearInterval(timer); } else { timer = setInterval(beat, HEARTBEAT_MS); }
    });

    // hitung total online (global)
    const listRef = ref(db, `presence/${SCOPE}`);
    onValue(listRef, (snap) => {
      const myTs = snap.child(uid)?.child(sessionId)?.val()?.ts;
      const now = (typeof myTs === "number") ? myTs : Date.now();
      const fresh = countFreshSessions(snap, now);
      const fallback = countAllSessions(snap);
      badge.textContent = String(fresh > 0 ? fresh : fallback);
    });
  });

