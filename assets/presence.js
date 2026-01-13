import { rtdb, auth } from "./js/firebase-config.js";
import { ref, onValue, set, onDisconnect, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

/**
 * PRESENCE SYSTEM
 * Melacak status online/offline user secara realtime.
 */

onAuthStateChanged(auth, (user) => {
  if (user) {
    const uid = user.uid;
    const userStatusRef = ref(rtdb, `/status/${uid}`);
    const connectedRef = ref(rtdb, ".info/connected");

    onValue(connectedRef, (snap) => {
      if (snap.val() === true) {
        
        // 1. Set status to OFFLINE when disconnected
        onDisconnect(userStatusRef).set({
            state: "offline",
            lastChanged: serverTimestamp()
        }).then(() => {
            
            // 2. Set status to ONLINE when connected
            set(userStatusRef, {
                state: "online",
                lastChanged: serverTimestamp()
            });
        });
      }
    });
  }
});
