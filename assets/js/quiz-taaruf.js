let ACTIVE_THEME = null;

let ACTIVE_QUIZ_ID = null;
let ACTIVE_QUIZ_TITLE = null;


window.stopActiveQuiz?.();



import {
  addDoc,
  collection,
  serverTimestamp,
  getDocs,
  query,
  where
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

import {
  doc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

import {
  getDoc
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

import { setDoc, increment } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";



// ===============================
// CONTEXT GLOBAL
// ===============================
const { db, getCurrentUser } = window.__APP_CONTEXT__;

// ===============================
// KONFIGURASI
// ===============================
const TOTAL_TIME = 60;


// ===============================
// HELPER: SHUFFLE (WAJIB ADA)
// ===============================
function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}


// ===============================
// AMBIL DATA SOAL
// ===============================
function buildQuizData(theme) {
  const source = window.VOCABS.filter(v => v.tema === theme);

  return shuffle(source).map(v => {
    const correct = v.id;
    const wrongs = shuffle(
      source.filter(x => x.id !== correct).map(x => x.id)
    ).slice(0, 3);

    const options = shuffle([correct, ...wrongs]);

    return {
      question: `Apa arti dari "${v.ar}"?`,
      options,
      correctIndex: options.indexOf(correct)
    };
  });
}


// ===============================
// STATE
// ===============================

const quizState = {
  index: 0,
  score: 0,
  timeLeft: TOTAL_TIME,
  timer: null,
  answered: false,
  finished: false,
  data: []
};



// ===============================
// ELEMENT
// ===============================
const btnThemeTaaruf  = document.getElementById("btnThemeTaaruf");
const btnThemeSekolah = document.getElementById("btnThemeSekolah");
const btnThemeKeluarga = document.getElementById("btnThemeKeluarga");
const btnThemeHewan = document.getElementById("btnThemeHewan");


// const btnStart = document.getElementById("btnStartQuiz");
const quizBox  = document.getElementById("quizBox");
const qText    = document.getElementById("quizQuestion");
const optsBox  = document.getElementById("quizOptions");
const feedback = document.getElementById("quizFeedback");
const btnNext  = document.getElementById("nextQuestion");

const timerEl = document.createElement("p");
timerEl.className = "mb-3 font-semibold text-red-500";
quizBox.prepend(timerEl);


// ===============================
// START QUIZ
// ===============================
function startQuiz(theme, quizId, quizTitle) {

  if (!window.VOCABS || !Array.isArray(window.VOCABS)) {
  alert("Data soal belum siap");
  return;
}


  ACTIVE_THEME = theme;

  ACTIVE_QUIZ_ID = quizId;
  ACTIVE_QUIZ_TITLE = quizTitle;

  quizState.index = 0;
  quizState.score = 0;
  quizState.timeLeft = TOTAL_TIME;
  quizState.finished = false;
  quizState.answered = false;

  quizState.data = buildQuizData(theme);

  quizBox.classList.remove("hidden");

  startTimer();
  loadQuestion();
}

// ---
 if (btnThemeTaaruf) {
  btnThemeTaaruf.onclick = () => {
    startQuiz("taaruf", "taaruf-1", "Kuis Ta'aruf");
  };
}

if (btnThemeSekolah) {
  btnThemeSekolah.onclick = () => {
    startQuiz("sekolah", "school-1", "Kuis Sekolah");
  };
}

if (btnThemeKeluarga) {
  btnThemeKeluarga.onclick = () => {
    startQuiz("keluarga", "keluarga-1", "Kuis Keluarga");
  };
}

if (btnThemeHewan) {
  btnThemeHewan.onclick = () => {
    startQuiz("hewan", "hewan-1", "Kuis Binatang");
  };
}


// ------



// ===============================
// TIMER (GLOBAL — 1x SAJA)
// ===============================
function startTimer() {
  if (quizState.timer) {
    clearInterval(quizState.timer);
  }

  quizState.timer = setInterval(() => {
    quizState.timeLeft--;

    timerEl.textContent = `⏱️ ${quizState.timeLeft} detik`;

    if (quizState.timeLeft <= 0) {
      clearInterval(quizState.timer);
      finishQuiz();
    }
  }, 1000);
}


// ===============================
// LOAD SOAL
// ===============================
function loadQuestion() {
  quizState.answered = false;
  btnNext.classList.add("hidden");
  feedback.textContent = "";

  const q = quizState.data[quizState.index];
  if (!q) return finishQuiz();

  const arabMatch = q.question.match(/"(.*?)"/);
  const arabText = arabMatch ? arabMatch[1] : "";

  qText.innerHTML = "";
  // MENGURANGI MARGIN: dari mb-8 menjadi mb-4
  qText.className = "text-center mb-4 py-2"; 

  const label = document.createElement("div");
  label.textContent = "Apa arti dari:";
  // MENGURANGI SPASI BAWAH LABEL: dari mb-4 menjadi mb-1
  label.className = "text-[10px] md:text-xs font-bold uppercase tracking-widest text-slate-400 mb-1";

  const arab = document.createElement("div");
  arab.textContent = arabText;
  
  // OPTIMASI JARAK ARAB:
  // leading-[1.6] : jarak antar baris yang lebih rapat namun tetap aman untuk harakat
  // text-3xl : ukuran sedikit lebih kecil agar tidak memakan terlalu banyak ruang vertikal
  arab.className = "text-3xl md:text-5xl font-bold leading-[1.6] text-slate-800 dark:text-white transition-all";
  
  arab.style.direction = "rtl";
  arab.style.fontFamily = "'Amiri', 'Scheherazade New', serif";

  qText.appendChild(label);
  qText.appendChild(arab);

  optsBox.innerHTML = "";
  q.options.forEach((text, i) => {
    const btn = document.createElement("button");
    btn.textContent = text;
    // MENGURANGI PADDING TOMBOL: dari py-4 menjadi py-3
    btn.className = 
      "w-full text-center md:text-left border-2 border-slate-100 dark:border-slate-700 rounded-xl px-6 py-3 " +
      "text-slate-700 dark:text-slate-200 font-semibold shadow-sm " +
      "hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-slate-700/50 " +
      "transition-all duration-200 active:scale-[0.98]";
      
    btn.onclick = () => checkAnswer(i);
    optsBox.appendChild(btn);
  });
}




// ===============================
// CEK JAWABAN
// ===============================
function checkAnswer(selectedIndex) {
  if (quizState.answered) return;
  quizState.answered = true;

  const q = quizState.data[quizState.index];

  const buttons = optsBox.querySelectorAll("button");

  buttons.forEach((btn, i) => {
    btn.disabled = true;
    if (i === q.correctIndex) {
      btn.classList.add("bg-green-500", "text-white");
    }
  });

  if (selectedIndex === q.correctIndex) {
    quizState.score++;
    feedback.textContent = "✅ Benar!";
    feedback.className = "font-bold text-green-500";
  } else {
    feedback.textContent = "❌ Salah!";
    feedback.className = "font-bold text-red-500";
  }

  btnNext.classList.remove("hidden");
}





// ===============================
// NEXT
// ===============================
btnNext.onclick = () => {
  quizState.index++;
  loadQuestion();
};


// ===============================
// FINISH QUIZ
// ===============================
async function finishQuiz() {
  if (quizState.finished) return;
  quizState.finished = true;

  // 1. Hentikan Timer
  if (quizState.timer) {
    clearInterval(quizState.timer);
    quizState.timer = null;
  }

  // --- [BARU] BERSIHKAN AREA KUIS ---
  // Ini akan menghapus soal, pilihan ganda, dan menyembunyikan tombol
  if (qText) qText.textContent = "";       // Hapus teks soal
  if (optsBox) optsBox.innerHTML = "";     // Hapus pilihan jawaban (tombol A,B,C,D)
  if (feedback) feedback.textContent = ""; // Hapus feedback (jika ada)
  if (timerEl) timerEl.textContent = "";   // Hapus teks timer
  
  if (btnNext) {
    btnNext.classList.add("hidden");       // Sembunyikan tombol Next
  }
  
  // Opsional: Jika Anda punya ID container pembungkus kuis, bisa disembunyikan total
  // document.getElementById('quiz-card').classList.add('hidden');
  // ----------------------------------

  // 2. Hitung Skor & Status
  const total = quizState.data.length;
  const score = quizState.score;
  const percentage = Math.round((score / total) * 100);

  let title, message, icon, colorClass, bgClass, borderClass;

  if (percentage === 100) {
    title = "Mumtaz! (Luar Biasa)";
    message = "Sempurna! Penguasaan materi yang sangat baik.";
    icon = "🏆";
    colorClass = "text-emerald-600 dark:text-emerald-400";
    bgClass = "bg-emerald-50 dark:bg-emerald-900/20";
    borderClass = "border-emerald-200 dark:border-emerald-700";
  } else if (percentage >= 70) {
    title = "Jayyid Jiddan (Sangat Baik)";
    message = "Hebat! Sedikit lagi menuju sempurna.";
    icon = "🌟";
    colorClass = "text-blue-600 dark:text-blue-400";
    bgClass = "bg-blue-50 dark:bg-blue-900/20";
    borderClass = "border-blue-200 dark:border-blue-700";
  } else {
    title = "Man Jadda Wajada";
    message = "Jangan menyerah! Coba ulangi materi ini lagi.";
    icon = "📚";
    colorClass = "text-slate-600 dark:text-slate-400";
    bgClass = "bg-slate-50 dark:bg-slate-800";
    borderClass = "border-slate-200 dark:border-slate-700";
  }

  // 3. Tampilkan Pop-up Hasil
  const popupHTML = `
    <div id="quiz-result-overlay" class="fixed inset-0 z-[999] flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4 animate-fade-in">
      
      <div class="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl overflow-hidden transform transition-all scale-100 animate-bounce-in border border-slate-100 dark:border-slate-800">
        
        <button onclick="closeQuizPopup()" class="absolute top-4 left-4 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all z-10">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div class="h-28 ${bgClass} flex items-center justify-center relative overflow-hidden">
          <div class="absolute inset-0 opacity-10" style="background-image: radial-gradient(currentColor 1px, transparent 1px); background-size: 10px 10px;"></div>
          <div class="text-7xl transform translate-y-2 filter drop-shadow-md animate-bounce">${icon}</div>
        </div>

        <div class="px-6 pt-8 pb-8 text-center space-y-5">
          <div>
            <h3 class="font-black text-xl md:text-2xl ${colorClass} uppercase tracking-widest mb-2 leading-tight">${title}</h3>
            <p class="text-sm text-slate-500 dark:text-slate-400 font-medium px-2 leading-relaxed">
              ${message}
            </p>
          </div>

          <div class="py-4 border-y ${borderClass} border-dashed flex flex-col items-center justify-center gap-1 bg-slate-50/50 dark:bg-slate-800/50 rounded-xl">
            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Skor Akhir</span>
            <div class="flex items-baseline gap-1">
              <span class="text-6xl font-black ${colorClass} font-sans tracking-tighter">${score}</span>
              <span class="text-xl font-bold text-slate-300">/${total}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', popupHTML);

  // 4. Simpan Hasil
  await saveResult();
}

// Fungsi Helper untuk menutup Pop-up
// Jadikan fungsi global agar bisa dipanggil oleh tombol onclick di HTML
window.closeQuizPopup = function() {
  const overlay = document.getElementById('quiz-result-overlay');
  
  if (overlay) {
    // 1. Tambahkan class untuk memicu transisi pudar (Fade Out)
    // Pastikan elemen overlay memiliki class 'transition-opacity' & 'duration-300' di HTML-nya
    overlay.classList.remove('opacity-100'); 
    overlay.classList.add('opacity-0');

    // 2. Tunggu animasi selesai (300ms) baru hapus elemen dari HTML
    setTimeout(() => {
      overlay.remove();
      
      // Opsional: Jika ingin reset kuis otomatis saat ditutup
      // window.location.reload(); 
    }, 300);
  } else {
    console.warn("Overlay tidak ditemukan!");
  }
};

// ===============================
// SIMPAN KE FIRESTORE
// ===============================
async function saveResult() {
  const authUser = getCurrentUser();
  if (!authUser) return;

  const uid = authUser.uid;
  const score = quizState.score;

  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    console.error("Data siswa tidak ditemukan");
    return;
  }

  const user = userSnap.data();
  const skorLama = user.skorTerbaik ?? 0;

  // ===============================
  // 1️⃣ SIMPAN RIWAYAT KUIS
  // ===============================
  await addDoc(collection(db, "quizResults"), {
    uid,
    nama: user.nama,
    kelas: user.kelas,
    quizId: ACTIVE_QUIZ_ID,
    quizTitle: ACTIVE_QUIZ_TITLE,
    score,
    totalSoal: quizState.data.length,
    createdAt: serverTimestamp()
  });

  // ===============================
// 2️⃣ HITUNG TOTAL BARU (AMAN)
// ===============================
const prevTotal = typeof user.poinTotal === "number"
  ? user.poinTotal
  : 0;

const newTotal = prevTotal + score;

const updateData = {
  jumlahMain: increment(1),
  skorTerbaik: score > skorLama ? score : skorLama,
  poinTotal: newTotal
};

await updateDoc(userRef, updateData);


  // ===============================
// 3️⃣ UPDATE LEADERBOARD (SUMBER DARI USERS)
// ===============================
await setDoc(
  doc(db, "leaderboard", uid),
  {
    uid,
    nama: user.nama,
    kelas: user.kelas,
    poinTotal: newTotal,
    updatedAt: serverTimestamp()
  },
  { merge: true }
);

}


// ================= DAFTARKAN KUIS TA'ARUF SEBAGAI AKTIF =================
window.__ACTIVE_QUIZ__ = {
  stop() {
    // hentikan timer jika masih jalan
    if (quizState && quizState.timer) {
      clearInterval(quizState.timer);
      quizState.timer = null;
    }

    // sembunyikan quizBox
    const quizBox = document.getElementById("quizBox");
    if (quizBox) quizBox.classList.add("hidden");
  }
};


export function initQuiz() {
  const btnTaaruf  = document.getElementById("btnThemeTaaruf");
  const btnSekolah = document.getElementById("btnThemeSekolah");

  if (!btnTaaruf || !btnSekolah) {
    console.warn("❌ Tombol kuis tidak ditemukan");
    return;
  }

  btnTaaruf.onclick = () => {
    startQuiz("taaruf", "taaruf-1", "Kuis Ta'aruf");
  };

  btnSekolah.onclick = () => {
    startQuiz("sekolah", "school-1", "Kuis Sekolah");
  };

  console.log("✅ Kuis siap dimainkan");
}









