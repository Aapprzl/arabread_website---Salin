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

  // ===== PISAHKAN TEKS INDONESIA & ARAB =====
  // q.question contoh: Apa arti dari "الثعلب"?
  const arabMatch = q.question.match(/"(.*?)"/);
  const arabText = arabMatch ? arabMatch[1] : "";

  // Bersihkan isi soal
  qText.innerHTML = "";
  qText.className = "text-center mb-4";

  // Label Indonesia
  const label = document.createElement("div");
  label.textContent = "Apa arti dari:";
  label.className = "text-sm text-slate-400 mb-2";

  // Teks Arab (DIBESARKAN)
  const arab = document.createElement("div");
  arab.textContent = arabText;
  arab.className =
    "text-2xl font-semibold leading-relaxed text-center";
  arab.style.direction = "rtl";
  arab.style.fontFamily = "'Amiri','Scheherazade New',serif";

  qText.appendChild(label);
  qText.appendChild(arab);

  // ===== OPSI JAWABAN (TIDAK DIUBAH) =====
  optsBox.innerHTML = "";

  q.options.forEach((text, i) => {
    const btn = document.createElement("button");
    btn.textContent = text;
    btn.className =
      "w-full text-left border rounded-lg px-4 py-2 hover:bg-blue-100 dark:hover:bg-slate-600";
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

  if (quizState.timer) {
    clearInterval(quizState.timer);
    quizState.timer = null;
  }

  qText.textContent = "🎉 Kuis Selesai";
  optsBox.innerHTML = "";
  btnNext.classList.add("hidden");
  timerEl.textContent = "";

  feedback.textContent =
  `Skor kamu: ${quizState.score} / ${quizState.data.length}`;

  feedback.className = "font-bold text-blue-500";

  // btnStart.disabled = false;
  // btnStart.classList.remove("opacity-50");

  await saveResult();
  


}

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









