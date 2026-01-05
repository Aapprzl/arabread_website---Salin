let ACTIVE_THEME = null;


// ================= KUIS SEKOLAH =================

// hentikan kuis lain
window.stopActiveQuiz?.();

import {
  getDoc,
  doc,
  collection,
  addDoc,
  updateDoc,
  setDoc,
  increment,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";



// ================= KONFIGURASI =================
const QUIZ_ID    = "school-1";
const QUIZ_TITLE = "Kuis Sekolah";
const TOTAL_TIME = 30;

// ================= CONTEXT =================
const { db, getCurrentUser } = window.__APP_CONTEXT__;

// ================= AMBIL SOAL =================
const sourceVocabs = window.VOCABS.filter(
  v => v.tema === "sekolah"
);

// gunakan fungsi shuffle dari taaruf (copy aman)
function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

const quizData = shuffle(sourceVocabs).map(v => {
  const correct = v.id;
  const wrongs = shuffle(
    sourceVocabs.filter(x => x.id !== correct).map(x => x.id)
  ).slice(0, 3);

  const options = shuffle([correct, ...wrongs]);

  return {
    question: `Apa arti dari "${v.ar}"?`,
    options,
    correctIndex: options.indexOf(correct)
  };
});

// ================= STATE =================
const quizState = {
  index: 0,
  score: 0,
  timeLeft: TOTAL_TIME,
  timer: null,
  answered: false,
  finished: false
};

// ================= DOM =================
const btnStart = document.getElementById("btnStartQuizSchool");
const quizBox  = document.getElementById("quizBox");
const qText    = document.getElementById("quizQuestion");
const optsBox  = document.getElementById("quizOptions");
const feedback = document.getElementById("quizFeedback");
const btnNext  = document.getElementById("nextQuestion");

// ================= TIMER =================
const timerEl = document.createElement("p");
timerEl.className = "mb-3 font-semibold text-red-500";
quizBox.prepend(timerEl);

function startTimer() {
  clearInterval(quizState.timer);
  quizState.timer = setInterval(() => {
    quizState.timeLeft--;
    timerEl.textContent = `⏱️ ${quizState.timeLeft} detik`;
    if (quizState.timeLeft <= 0) finishQuiz();
  }, 1000);
}

// ================= START LOGIC =================
function startQuizInternal() {
  quizState.index = 0;
  quizState.score = 0;
  quizState.timeLeft = TOTAL_TIME;
  quizState.finished = false;
  quizState.answered = false;

  quizBox.classList.remove("hidden");
  startTimer();
  loadQuestion();
}

// klik manual (jika user klik tombol langsung)
btnStart.onclick = startQuizInternal;


// ================= LOAD SOAL =================
function loadQuestion() {
  quizState.answered = false;
  btnNext.classList.add("hidden");
  feedback.textContent = "";

  const q = quizData[quizState.index];
  if (!q) return finishQuiz();

  qText.textContent = q.question;
  optsBox.innerHTML = "";

  q.options.forEach((text, i) => {
    const btn = document.createElement("button");
    btn.textContent = text;
    btn.className =
      "w-full text-left border rounded-lg px-4 py-2 hover:bg-blue-100";
    btn.onclick = () => checkAnswer(i);
    optsBox.appendChild(btn);
  });
}

// ================= CEK =================
function checkAnswer(i) {
  if (quizState.answered) return;
  quizState.answered = true;

  const q = quizData[quizState.index];
  const buttons = optsBox.querySelectorAll("button");

  buttons.forEach((btn, idx) => {
    btn.disabled = true;
    if (idx === q.correctIndex) {
      btn.classList.add("bg-green-500", "text-white");
    }
  });

  if (i === q.correctIndex) {
    quizState.score++;
    feedback.textContent = "✅ Benar!";
    feedback.className = "font-bold text-green-500";
  } else {
    feedback.textContent = "❌ Salah!";
    feedback.className = "font-bold text-red-500";
  }

  btnNext.classList.remove("hidden");
}

// ================= NEXT =================
btnNext.onclick = () => {
  quizState.index++;
  loadQuestion();
};

// ================= FINISH =================
async function finishQuiz() {
  if (quizState.finished) return;
  quizState.finished = true;

  clearInterval(quizState.timer);
  timerEl.textContent = "";

  qText.textContent = "🎉 Kuis Selesai";
  optsBox.innerHTML = "";
  btnNext.classList.add("hidden");

  feedback.textContent =
    `Skor kamu: ${quizState.score} / ${quizData.length}`;
  feedback.className = "font-bold text-blue-500";

  await saveResult();
}

// refresh dashboard status (jika ada)
if (window.loadQuizSchoolStatus) {
  window.loadQuizSchoolStatus();
}


// ================= SIMPAN =================
async function saveResult() {
  const user = window.__APP_CONTEXT__?.getCurrentUser();
  if (!user) return;

  // ambil data siswa (SUDAH ADA)
  const snap = await getDoc(doc(db, "users", user.uid));
  if (!snap.exists()) return;

  const data = snap.data();

  // ================= SIMPAN RIWAYAT KUIS =================
  await addDoc(collection(db, "quizResults"), {
    uid: user.uid,
    nama: data.nama,
    kelas: data.kelas,
    quizId: QUIZ_ID,
    quizTitle: QUIZ_TITLE,
    score: quizState.score,
    totalSoal: quizData.length,
    createdAt: serverTimestamp()
  });

  // ================= UPDATE DATA SISWA =================
  const prevBest = data.bestScore?.school ?? 0;
  const prevAttempts = data.attempts?.school ?? 0;

  await updateDoc(doc(db, "users", user.uid), {
    "bestScore.school": Math.max(prevBest, quizState.score),
    "attempts.school": prevAttempts + 1
  });

  // ================= UPDATE LEADERBOARD =================
  await setDoc(
    doc(db, "leaderboard", user.uid),
    {
      nama: data.nama,
      kelas: data.kelas,
      pointTotal: increment(quizState.score)
    },
    { merge: true }
  );
}



// ================= DAFTAR AKTIF =================
window.__ACTIVE_QUIZ__ = {
  stop() {
    if (quizState.timer) {
      clearInterval(quizState.timer);
      quizState.timer = null;
    }
    quizBox.classList.add("hidden");
  }
};

export function startQuiz() {
  startQuizInternal();
}


