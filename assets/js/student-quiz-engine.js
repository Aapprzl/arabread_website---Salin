
// ===============================
// STUDENT QUIZ ENGINE (GENERIC)
// ===============================

const TOTAL_TIME = 60;
let ACTIVE_THEME_ID = null;
let ACTIVE_THEME_TITLE = null;

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
// HELPER: SHUFFLE
// ===============================
function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

// ===============================
// BUILD QUIZ DATA (FROM VOCAB)
// ===============================
export function buildQuizDataFromVocab(vocabList) {
  if (!vocabList || vocabList.length < 4) {
      console.warn("Not enough vocab data to generate quiz");
      return [];
  }

  // Ensure unique questions
  const source = shuffle(vocabList);
  
  return source.map(v => {
    // Determine correct answer
    // Supports various key formats: id, arti, mean, etc.
    const correct = v.arti || v.mean || v.idn || v.id || "?";
    const arabic = v.ar || v.arabic || "?";

    // Select 3 wrong answers
    const wrongs = shuffle(
      vocabList.filter(x => {
          const xMean = x.arti || x.mean || x.idn || x.id;
          return xMean !== correct;
      }).map(x => x.arti || x.mean || x.idn || x.id)
    ).slice(0, 3);

    const options = shuffle([correct, ...wrongs]);

    return {
      question: `Apa arti dari "${arabic}"?`,
      arabic: arabic,
      options,
      correctIndex: options.indexOf(correct)
    };
  });
}


// ===============================
// UI ELEMENTS
// ===============================
const quizBox = document.getElementById("quizBox");
const qText = document.getElementById("quizQuestion");
const optsBox = document.getElementById("quizOptions");
const feedback = document.getElementById("quizFeedback");
const btnNext = document.getElementById("nextQuestion");

let timerEl = null;

// ===============================
// START QUIZ
// ===============================
export function startStudentQuiz(themeData) {
    if(!themeData) return;

    // 1. Prepare Data
    let vocabData = [];
    try {
        if(typeof themeData.vocabData === 'string') {
            vocabData = JSON.parse(themeData.vocabData);
        } else if(Array.isArray(themeData.vocabData)) {
            vocabData = themeData.vocabData;
        }
    } catch(e) {
        console.error("Failed to parse vocab for quiz", e);
    }

    if(vocabData.length < 4) {
        alert("Maaf, materi ini belum memiliki cukup kosakata untuk dijadikan kuis.");
        return;
    }

    // 2. Init State
    ACTIVE_THEME_ID = themeData.id;
    ACTIVE_THEME_TITLE = themeData.title;

    quizState.index = 0;
    quizState.score = 0;
    quizState.timeLeft = TOTAL_TIME;
    quizState.finished = false;
    quizState.answered = false;
    quizState.data = buildQuizDataFromVocab(vocabData);

    // 3. Setup UI
    if(quizBox.classList.contains('hidden')) {
        quizBox.classList.remove('hidden');
        // Scroll to quiz box
        quizBox.scrollIntoView({behavior: 'smooth'});
    }

    // Timer UI
    if(!timerEl) {
        timerEl = document.createElement("p");
        timerEl.className = "mb-3 font-semibold text-red-500 animate-pulse text-center";
        quizBox.prepend(timerEl);
    }
    timerEl.textContent = `⏱️ ${TOTAL_TIME} detik`;

    // CANCEL BUTTON (Dynamic)
    let cancelBtn = document.getElementById("quizCancelBtn");
    if(!cancelBtn) {
        cancelBtn = document.createElement("button");
        cancelBtn.id = "quizCancelBtn";
        cancelBtn.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
          <span class="text-xs font-bold">Batal</span>
        `;
        // Position Absolute Top Left
        // Ensure quizBox is relative
        if(!quizBox.classList.contains("relative")) quizBox.classList.add("relative");
        
        cancelBtn.className = "absolute top-2 left-2 flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-500 hover:bg-red-100 rounded-lg transition-all z-20";
        cancelBtn.onclick = window.cancelQuiz;
        quizBox.appendChild(cancelBtn);
    }
    cancelBtn.classList.remove("hidden");

    startTimer();
    loadQuestion();
}

// ===============================
// CANCEL QUIZ
// ===============================
window.cancelQuiz = function() {
  if(quizState.timer) clearInterval(quizState.timer);
  quizState.timer = null;
  
  if(quizBox) {
      quizBox.classList.add("hidden");
  }
  
  // Optional: Reset UI
  if(timerEl) timerEl.textContent = "";
};


// ===============================
// TIMER
// ===============================
function startTimer() {
  if (quizState.timer) clearInterval(quizState.timer);

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
// LOAD QUESTION
// ===============================
function loadQuestion() {
  quizState.answered = false;
  btnNext.classList.add("hidden");
  feedback.textContent = "";

  const q = quizState.data[quizState.index];
  if (!q) return finishQuiz();

  qText.innerHTML = "";
  qText.className = "text-center mb-4 py-2 relative pt-8";

  const label = document.createElement("div");
  label.textContent = "Apa arti dari:";
  label.className = "absolute top-0 left-0 text-[10px] md:text-xs font-bold uppercase tracking-widest text-slate-400";

  const arab = document.createElement("div");
  arab.textContent = q.arabic;
  arab.className = "text-4xl md:text-5xl font-bold leading-[1.6] text-slate-800 dark:text-white transition-all";
  arab.style.direction = "rtl";
  arab.style.fontFamily = "'Amiri', 'Scheherazade New', serif";

  qText.appendChild(label);
  qText.appendChild(arab);

  optsBox.innerHTML = "";
  q.options.forEach((text, i) => {
    const btn = document.createElement("button");
    btn.textContent = text;
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
// CHECK ANSWER
// ===============================
function checkAnswer(selectedIndex) {
  if (quizState.answered) return;
  quizState.answered = true;

  const q = quizState.data[quizState.index];
  const buttons = optsBox.querySelectorAll("button");

  buttons.forEach((btn, i) => {
    btn.disabled = true;
    if (i === q.correctIndex) {
      btn.classList.add("bg-green-500", "text-white", "border-green-500");
    } else if (i === selectedIndex) {
       btn.classList.add("bg-red-500", "text-white", "border-red-500");
    }
  });

  if (selectedIndex === q.correctIndex) {
    quizState.score++;
    feedback.textContent = "✅ Benar!";
    feedback.className = "font-bold text-green-500";
    
    // Auto Next (Optional, but user likes manual flow usually?) 
    // Wait, original had btnNext. Let's keep it.
  } else {
    feedback.textContent = "❌ Salah!";
    feedback.className = "font-bold text-red-500";
  }

  btnNext.classList.remove("hidden");
}

btnNext.onclick = () => {
  quizState.index++;
  loadQuestion();
};


// ===============================
// FINISH QUIZ
// ===============================
import {
  doc,
  getDoc,
  updateDoc,
  addDoc,
  collection,
  serverTimestamp,
  setDoc,
  increment
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

async function finishQuiz() {
  if (quizState.finished) return;
  quizState.finished = true;

  if (quizState.timer) {
    clearInterval(quizState.timer);
    quizState.timer = null;
  }

  // Cleanup UI
  if (qText) qText.textContent = "";
  if (optsBox) optsBox.innerHTML = "";
  if (feedback) feedback.textContent = "";
  if (btnNext) btnNext.classList.add("hidden");
  if (timerEl) timerEl.textContent = "";

  // Calculate
  const total = quizState.data.length;
  const score = quizState.score;
  const percentage = Math.round((score / total) * 100);

  // Result Popup Logic (Copied from original)
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

    // Popup HTML
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
            <p class="text-sm text-slate-500 dark:text-slate-400 font-medium px-2 leading-relaxed">${message}</p>
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

  // Save Result
  await saveResultToFirestore(score, total);
}

// Window Global Helper
window.closeQuizPopup = function () {
  const overlay = document.getElementById('quiz-result-overlay');
  if (overlay) {
    overlay.classList.remove('opacity-100');
    overlay.classList.add('opacity-0');
    setTimeout(() => {
        overlay.remove();
        // Hide quiz box on close
        if(quizBox) quizBox.classList.add('hidden');
    }, 300);
  }
};

async function saveResultToFirestore(score, total) {
    if(!window.db || !window.currentUser) return;
    
    const db = window.db;
    const uid = window.currentUser.uid;
    const userRef = doc(db, "users", uid);

    // 1. History (Unified to Submissions)
    await addDoc(collection(db, "submissions"), {
        type: 'game_history',
        uid,
        nama: window.currentUser.nama,
        kelas: window.currentUser.kelas,
        quizId: ACTIVE_THEME_ID,
        quizTitle: `Kuis ${ACTIVE_THEME_TITLE}`,
        score,
        totalSoal: total,
        createdAt: serverTimestamp(),
        timestamp: Date.now()
    });

    // 2. Update stats
    // We assume user doc exists since they are logged in.
    // Fetch current to check best score
    const snap = await getDoc(userRef);
    const data = snap.data();
    const oldBest = data.skorTerbaik || 0;
    const oldTotal = data.poinTotal || 0;

    await updateDoc(userRef, {
        jumlahMain: increment(1),
        skorTerbaik: Math.max(oldBest, score),
        poinTotal: oldTotal + score
    });

    // 3. Leaderboard
    await setDoc(doc(db, "leaderboard", uid), {
        uid,
        nama: window.currentUser.nama,
        kelas: window.currentUser.kelas,
        poinTotal: oldTotal + score,
        updatedAt: serverTimestamp()
    }, { merge: true });
}
