// ===============================
// QUIZ TA'ARUF — FINAL VERSION
// ===============================

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
const QUIZ_ID    = "taaruf-1";
const QUIZ_TITLE = "Kuis Ta'aruf";
const TOTAL_TIME = 30;
const PENALTY    = 5;

// ===============================
// AMBIL DATA SOAL
// ===============================
const sourceVocabs = window.VOCABS.filter(v => v.tema === "taaruf");

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

// ===============================
// STATE
// ===============================

const quizState = {
  index: 0,
  score: 0,
  timeLeft: TOTAL_TIME,
  timer: null,
  answered: false,
  finished: false
};



// ===============================
// ELEMENT
// ===============================
const btnStart = document.getElementById("btnStartQuiz");
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
btnStart.onclick = () => {
  quizState.index = 0;
  quizState.score = 0;
  quizState.timeLeft = TOTAL_TIME;
  quizState.finished = false;
  quizState.answered = false;

  btnStart.disabled = true;
  btnStart.classList.add("opacity-50");

  quizBox.classList.remove("hidden");
  startTimer();
  loadQuestion();
};



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

  const q = quizData[quizState.index];
  if (!q) return finishQuiz();

  qText.textContent = q.question;
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

  const q = quizData[quizState.index];
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
    `Skor kamu: ${quizState.score} / ${quizData.length}`;
  feedback.className = "font-bold text-blue-500";

  btnStart.disabled = false;
  btnStart.classList.remove("opacity-50");

  await saveResult();
  await updateLeaderboard(quizState.score);


}

// ===============================
// SIMPAN KE FIRESTORE
// ===============================
async function saveResult() {
  const authUser = await getCurrentUser();
  if (!authUser) return;

  const uid = authUser.uid;

  const userRef  = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    console.error("Data siswa tidak ditemukan di Firestore");
    return;
  }

  const user = userSnap.data();
  const score = quizState.score;

  // 1️⃣ SIMPAN RIWAYAT KUIS
  await addDoc(collection(db, "quizResults"), {
    uid,
    nama: user.nama,
    kelas: user.kelas,
    quizId: QUIZ_ID,
    quizTitle: QUIZ_TITLE,
    score,
    totalSoal: quizData.length,
    createdAt: serverTimestamp()
  });

  // 2️⃣ AMBIL SEMUA RIWAYAT KUIS TA'ARUF
  const qSnap = await getDocs(
    query(
      collection(db, "quizResults"),
      where("uid", "==", uid),
      where("quizId", "==", QUIZ_ID)
    )
  );

  // 3️⃣ HITUNG SKOR TERBAIK
  let best = 0;
  qSnap.forEach(d => {
    const data = d.data();
    if (typeof data.score === "number") {
      best = Math.max(best, data.score);
    }
  });

  // 4️⃣ UPDATE DATA SISWA
  const prevTotal = user.poinTotal ?? 0;

  await updateDoc(userRef, {
    poin: best,                    // skor terbaik
    poinTotal: prevTotal + score   // total sepanjang waktu
  });

  // 5️⃣ UPDATE LEADERBOARD
  await setDoc(
    doc(db, "leaderboard", uid),
    {
      nama: user.nama,
      kelas: user.kelas,
      poinTotal: prevTotal + score
    },
    { merge: true }
  );
}


async function updateLeaderboard(poin) {
  console.log("🔥 updateLeaderboard DIPANGGIL, poin:", poin);

  if (!window.__APP_CONTEXT__) {
    console.log("❌ __APP_CONTEXT TIDAK ADA");
    return;
  }

  const { db, getCurrentUser } = window.__APP_CONTEXT__;

  const userAuth = getCurrentUser();
  console.log("👤 userAuth:", userAuth);

  if (!userAuth) {
    console.log("❌ userAuth NULL");
    return;
  }

  const userRef = doc(db, "users", userAuth.uid);
  const userSnap = await getDoc(userRef);

  console.log("📄 userSnap exists:", userSnap.exists());

  if (!userSnap.exists()) {
    console.log("❌ user TIDAK ADA di collection users");
    return;
  }

  const user = userSnap.data();
  console.log("✅ DATA USER:", user);

  const lbRef = doc(db, "leaderboard", userAuth.uid);

  await setDoc(
    lbRef,
    {
      nama: user.nama,
      kelas: user.kelas,
      poinTotal: increment(poin),
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );

  console.log("🏆 LEADERBOARD BERHASIL DISIMPAN");



}






