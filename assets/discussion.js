// assets/discussion.js
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  getDoc,
  doc,
  getDocs,
  writeBatch
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";


console.log("DISCUSSION.JS FINAL LOADED");

/* =========================
   HELPER (IKUT STRUKTUR LAMA)
========================= */
function getUser() {
  try {
    if (window.currentUser) return window.currentUser;
    if (window.CURRENT_USER) return window.CURRENT_USER;
    if (typeof currentUser !== "undefined") return currentUser;
  } catch (_) { }
  return null;
}

function getDB() {
  try {
    if (window.db) return window.db;
    if (typeof db !== "undefined") return db;
  } catch (_) { }
  return null;
}

/* =========================
   MAIN
========================= */
document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("discussionInput");
  const btnPost = document.getElementById("btnPostDiscussion");
  const feedEl = document.getElementById("discussionFeed");

  if (!input || !btnPost || !feedEl) {
    console.warn("Diskusi: elemen tidak ditemukan");
    return;
  }

  /* =========================
   ENTER = KIRIM
   SHIFT + ENTER = BARIS BARU
========================= */
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();   // ❌ jangan turun baris
      btnPost.click();      // ✅ kirim pesan
    }
  });



  /* =========================
     POST DISKUSI (FINAL)
========================= */
  btnPost.addEventListener("click", async () => {
    console.log("TOMBOL KIRIM DIKLIK");

    const user = getUser();
    const database = getDB();

    if (!user || !database) {
      alert("User belum siap, coba sebentar lagi");
      return;
    }

    const text = input.value.trim();
    if (!text) return;

    try {
      // 🔑 AMBIL DATA USER DARI FIRESTORE
      const userSnap = await getDoc(
        doc(database, "users", user.uid)
      );

      const userData = userSnap.exists()
        ? userSnap.data()
        : {};

      await addDoc(collection(database, "discussions"), {
        authorUid: user.uid,

        // ✅ NAMA SISWA / GURU DARI FIRESTORE
        authorName: userData.nama || user.email || "User",

        // ✅ ROLE ASLI (guru / student)
        authorRole: userData.role || "user",

        // (opsional, kalau mau dipakai di UI)
        kelas: userData.kelas || "",

        content: text,
        commentCount: 0,
        isPinned: false,
        isClosed: false,

        // 🔥 WAJIB untuk orderBy realtime
        createdAt: new Date()
      });

      input.value = "";
      console.log("DISKUSI BERHASIL DIKIRIM");
    } catch (err) {
      console.error("GAGAL KIRIM DISKUSI:", err);
      alert("Gagal mengirim diskusi");
    }
  });


  // =========================
  // TOMBOL HAPUS (AMAN)
  // =========================
  const clearBtn = document.getElementById("btnClearDiscussion");

  // Jika tombol tidak ada (halaman siswa), STOP di sini
  if (clearBtn) {

    // Sembunyikan default (akan dibuka jika guru)
    clearBtn.classList.add("hidden");

    // Cek role guru
    const waitRole = setInterval(async () => {
      const user = getUser();
      const db = getDB();
      if (!user || !db) return;

      clearInterval(waitRole);

      const snap = await getDoc(doc(db, "users", user.uid));
      if (!snap.exists()) return;

      if (snap.data().role === "guru") {
        clearBtn.classList.remove("hidden");
      }
    }, 200);

    // Handler hapus
    clearBtn.addEventListener("click", async () => {
      if (!confirm("⚠️ Hapus SEMUA diskusi? Tindakan ini tidak bisa dibatalkan.")) {
        return;
      }

      const db = getDB();
      if (!db) return alert("Database belum siap");

      try {
        const q = query(collection(db, "discussions"));
        const snap = await getDocs(q);

        if (snap.empty) {
          alert("Tidak ada diskusi untuk dihapus");
          return;
        }

        const batch = writeBatch(db);
        snap.forEach(docSnap => batch.delete(docSnap.ref));
        await batch.commit();

        alert("✅ Semua diskusi berhasil dihapus");
      } catch (err) {
        console.error("Gagal hapus diskusi:", err);
        alert("❌ Gagal menghapus diskusi");
      }
    });
  }



  // FORMAT WAKTU
  function formatJam(ts) {
    if (!ts) return "";
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit"
    });
  }

  function formatRole(role) {
    if (role === "guru") return "Guru";
    if (role === "student") return "Siswa";
    return role || "";
  }



  /* =========================
    FEED REALTIME (FINAL CHAT VERSION)
 ========================= */
  const waitFeed = setInterval(() => {
    const database = getDB();
    const user = getUser();
    if (!database || !user) return;


    clearInterval(waitFeed);

    const q = query(
      collection(database, "discussions"),
      orderBy("createdAt", "asc")
    );

    onSnapshot(
      q,
      (snap) => {
        feedEl.innerHTML = "";

        if (snap.empty) {
          feedEl.innerHTML =
            `<p class="text-slate-400 text-sm">Belum ada diskusi</p>`;
          return;
        }

        snap.forEach(docSnap => {
          const d = docSnap.data();

          const isMe = user && d.authorUid === user.uid;
          const isGuru = d.authorRole === "guru";

          const jam = formatJam(d.createdAt);
          const roleLabel = formatRole(d.authorRole);
          const kelas = d.kelas || "";

          feedEl.innerHTML += `
        <!-- 🔽 SELURUH TEMPLATE CHAT ANDA (TIDAK DIUBAH) -->
        <div class="flex ${isMe ? "justify-end" : "justify-start"} mb-2 px-[2%]">
          <div class="relative w-fit max-w-[85%] md:max-w-[75%]
            px-3 py-2 rounded-lg shadow-sm text-[15px] leading-relaxed break-words
            ${isMe
              ? "bg-[#d9fdd3] text-gray-900 dark:bg-[#005c4b] dark:text-gray-100 rounded-tr-none"
              : "bg-white text-gray-900 dark:bg-[#202c33] dark:text-gray-100 rounded-tl-none"
            }">
            ${!isMe ? `
              <div class="text-[12.5px] font-bold mb-0.5 leading-tight flex items-center gap-1
                ${isGuru ? "text-teal-600 dark:text-teal-400" : "text-orange-600 dark:text-orange-400"}">
                <span>${d.authorName}</span>
                ${isGuru
                ? `<span class="bg-teal-100 text-teal-700 dark:bg-teal-900/50 dark:text-teal-300
                        text-[9px] px-1 py-0.5 rounded border">GURU</span>`
                : kelas
                  ? `<span class="text-gray-400 text-[10px]">(${kelas})</span>`
                  : ""
              }
              </div>` : ""
            }
            <div>
              <span class="whitespace-pre-wrap mr-1">${d.content}</span>
              <span class="float-right mt-2 ml-2 text-[10px]
                ${isMe ? "text-gray-500" : "text-gray-400"}">
                ${jam || ""} ${isMe ? "✓✓" : ""}
              </span>
            </div>
          </div>
        </div>
      `;
        });

        // 🔥 AUTO SCROLL KE PESAN TERBARU
        feedEl.scrollTop = feedEl.scrollHeight;

      },
      (error) => {
        console.error("🔥 Snapshot error (discussion):", error);

        feedEl.innerHTML = `
      <p class="text-red-400 text-sm italic text-center mt-4">
        Koneksi diskusi terputus, silakan refresh halaman
      </p>
    `;
      }

    );

  }, 200);


});

/* =========================================
   PERBAIKAN FINAL (LOGIKA AMAN)
========================================= */

window.toggleDiscussion = function () {
  const container = document.getElementById("discussionContainer");
  const content = document.getElementById("discussionContent");
  const chevron = document.getElementById("chevronIcon");
  const feed = document.getElementById("discussionFeed");

  // Jika content pun tidak ditemukan, stop.
  if (!content) return;

  // LOGIKA PENGAMAN SISWA:
  // Jika tombol chevron (panah) TIDAK ADA, berarti ini halaman SISWA (yang tidak boleh toggle? atau beda logika).
  // Tapi di dashboard-siswa.html ada chevron.
  if (!chevron) {
    content.classList.remove("hidden");
    return; // Berhenti disini, jangan jalankan kode toggle di bawah
  }

  // LOGIKA TOGGLE
  content.classList.toggle("hidden");

  // Animasi Panah & Container Height
  if (content.classList.contains("hidden")) {
    // COLLAPSED
    chevron.classList.add("-rotate-90");
    if (container) {
      // Hapus fixed height agar container menyusut
      container.classList.remove("h-[75vh]", "md:h-[600px]");
      container.classList.add("h-auto");
    }
  } else {
    // EXPANDED
    chevron.classList.remove("-rotate-90");
    if (container) {
      // Kembalikan fixed height
      container.classList.remove("h-auto");
      container.classList.add("h-[75vh]", "md:h-[600px]");
    }
    if (feed) {
      setTimeout(() => {
        feed.scrollTop = feed.scrollHeight;
      }, 200);
    }
  }
};

