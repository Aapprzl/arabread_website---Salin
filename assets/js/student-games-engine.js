import { db, auth } from "./firebase-config.js"; // Ensure auth is imported
import { doc, updateDoc, increment, getDoc, addDoc, collection, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { insertArabicChar } from "./arabic-utils.js"; // NEW IMPORT

/**
 * STUDENT GAMES ENGINE
 * Mengatur logika 3 game (Grammar, Sentence, Harakat) di Dashboard Siswa.
 * Fitur Utama: Setiap jawaban BENAR = +1 Poin ke database.
 */

let currentUserUid = null;

// Listen for user login from the main dashboard script
// Also updated to real-time listener for robustness
window.initStudentGames = function(uid) {
  currentUserUid = uid;
  console.log("Student Games Initialized for UID:", uid);
  
  // Start Games
  initGrammarGame();
  initSentenceGame();
  initHarakatGame();

  // Auto Load First Question (Visual Only)
  if(window.loadGrammarQuestion) window.loadGrammarQuestion();
  if(window.loadSentenceGame) window.loadSentenceGame();
  if(window.loadHarakatGame) window.loadHarakatGame();
}

/**
 * HELPER: Wait for Auth (Race Condition Fix)
 */
function waitForAuth() {
    return new Promise((resolve) => {
        if (auth.currentUser) return resolve(auth.currentUser);
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            unsubscribe();
            resolve(user);
        });
    });
}

/**
 * GLOBAL SCORING FUNCTION
 * Menambah 1 poin ke user saat ini.
 */
async function saveOnePoint(gameType = "Mini Game") {
  try {
    const user = await waitForAuth();
    if (!user) {
        console.warn("User not logged in, score not saved.");
        return;
    }
    
    // 1. Update Total Poin
    const userRef = doc(db, "users", user.uid);
    await updateDoc(userRef, {
      poinTotal: increment(1)
    });

    // 2. Record History in Submissions
    // Try to get name/class from window cache or Auth display name
    const nama = (window.currentUser && window.currentUser.nama) || user.displayName || "Siswa";
    const kelas = (window.currentUser && window.currentUser.kelas) || "-";

    await addDoc(collection(db, "submissions"), {
        type: 'game_history',
        uid: user.uid,
        nama: nama,
        kelas: kelas,
        quizTitle: gameType, // e.g. "Grammar Game"
        score: 1,
        totalSoal: 1,
        createdAt: serverTimestamp(),
        timestamp: Date.now()
    });

    console.log("Points +1 & History Saved!");
  } catch (error) {
    console.error("Error saving point:", error);
  }
}


/* ==========================================================================
   GAME 1: GRAMMAR QUIZ (TEBAK JENIS KATA)
   ========================================================================== */
function initGrammarGame() {
  // Config
  let GAME_DATA = window.GAME_DATA || [];
  
  // Debug & Fallback
  if (!GAME_DATA || !GAME_DATA.length) {
    console.warn("GAME_DATA missing! Using fallback.");
    GAME_DATA = [
      { word: "كِتَابٌ", type: "isim" }, 
      { word: "يَكْتُبُ", type: "fiil" }, 
      { word: "مِنْ", type: "harf" }
    ];
  } else {
    console.log("Grammar Game Data Loaded:", GAME_DATA.length);
  }

  let currentQuestion = null;
  let score = 0; // Visual score only
  let isPlaying = true; // Auto start for student dashboard
  
  const wordEl = document.getElementById('sg-grammar-word');
  const feedbackEl = document.getElementById('sg-grammar-feedback');
  const scoreEl = document.getElementById('sg-grammar-score');
  const overlay = document.getElementById('sg-grammar-overlay');
  
  if(!wordEl) {
    console.error("Critical: sg-grammar-word element not found!");
    return;
  }

  // Bind Buttons
  document.querySelectorAll('.sg-grammar-btn').forEach(btn => {
    // Clone to remove old listeners if re-init
    const newBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(newBtn, btn);
    newBtn.addEventListener('click', () => checkGrammarAnswer(newBtn.dataset.type));
  });
  
  window.resetGrammarGame = function() {
    isPlaying = true;
    score = 0;
    updateVisScore();
    if(overlay) overlay.classList.add('opacity-0', 'pointer-events-none');
    window.loadGrammarQuestion();
  };

  window.loadGrammarQuestion = function() {
    const q = GAME_DATA[Math.floor(Math.random() * GAME_DATA.length)];
    currentQuestion = q;
    
    if(wordEl) {
      wordEl.textContent = q.word;
      wordEl.classList.remove('text-green-500', 'text-red-500');
    }
    if(feedbackEl) feedbackEl.style.opacity = 0;
    console.log("Question Loaded:", q.word);
  };

  function checkGrammarAnswer(type) {
    if (!currentQuestion) return;

    if (type === currentQuestion.type) {
      // CORRECT
      score += 10;
      updateVisScore();
      showFeedback(true);
      saveOnePoint("Grammar Game"); // DATABASE SAVE
      setTimeout(window.loadGrammarQuestion, 800);
    } else {
      // WRONG
      showFeedback(false);
      // Optional penalty logic
    }
  }

  function showFeedback(isCorrect) {
    if(!feedbackEl) return;
    feedbackEl.textContent = isCorrect ? '✅' : '❌';
    feedbackEl.style.opacity = 1;
    feedbackEl.style.transform = "scale(1.2)";
    setTimeout(() => {
      feedbackEl.style.opacity = 0;
      feedbackEl.style.transform = "scale(0.5)";
    }, 400);
  }

  function updateVisScore() {
    if(scoreEl) scoreEl.textContent = score;
  }

  // Auto Start if visible? Or wait for user.
  // For now, let's expose start function
  window.startGrammarGame = window.resetGrammarGame;
  
  // Immediate load attempt
  window.loadGrammarQuestion();
}


/* ==========================================================================
   GAME 2: SENTENCE GAME (SUSUN KALIMAT)
   ========================================================================== */
function initSentenceGame() {
  let SENTENCE_DATA = window.SENTENCE_GAME_DATA || [];
  
  if (!SENTENCE_DATA || !SENTENCE_DATA.length) {
      console.warn("SENTENCE_DATA missing! Using fallback.");
      SENTENCE_DATA = [
         {
            title: "Kalimat Dasar",
            description: "Susun kalimat berikut",
            correct: ["أَنَا", "مُسْلِمٌ"]
         }
      ];
  } else {
      console.log("Sentence Game Data Loaded:", SENTENCE_DATA.length);
  }

  let currentQuestion = null;
  
  const wordBank = document.getElementById("sg-sentence-bank");
  const dropZone = document.getElementById("sg-sentence-drop");
  const titleEl = document.getElementById("sg-sentence-title");
  const descEl = document.getElementById("sg-sentence-desc");
  const checkBtn = document.getElementById("sg-sentence-check");

  if(!wordBank || !dropZone) return;

  window.loadSentenceGame = function() {
    currentQuestion = SENTENCE_DATA[Math.floor(Math.random() * SENTENCE_DATA.length)];
    renderSentenceQuestion();
  };

  function renderSentenceQuestion() {
    wordBank.innerHTML = "";
    dropZone.innerHTML = "";
    
    if(titleEl) titleEl.textContent = currentQuestion.title;
    if(descEl) descEl.textContent = currentQuestion.description;

    const shuffled = [...currentQuestion.correct].sort(() => Math.random() - 0.5);
    shuffled.forEach(word => wordBank.appendChild(createWord(word)));
  }

  function createWord(word) {
    const el = document.createElement("div");
    el.textContent = word;
    el.className = "px-4 py-2 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-arab text-xl cursor-pointer select-none border border-transparent hover:border-blue-400 active:scale-95 transition";
    
    el.addEventListener("click", () => {
      if (el.parentElement === wordBank) {
        dropZone.appendChild(el);
      } else {
        wordBank.appendChild(el);
      }
    });

    return el;
  }

  if(checkBtn) {
    checkBtn.addEventListener("click", () => {
      const userAnswer = [...dropZone.children].map(w => w.textContent);
      const correct = currentQuestion.correct;

      if (userAnswer.length === 0) return Swal.fire('Ops!', 'Susun kata dulu ya', 'warning');

      const isCorrect = userAnswer.every((w, i) => w === correct[i]) && userAnswer.length === correct.length;

      if (isCorrect) {
        Swal.fire({
            title: 'MUMTAZ! (Benar)',
            text: '+1 Poin',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false
        });
        saveOnePoint("Susun Kalimat"); // DATABASE SAVE
        setTimeout(window.loadSentenceGame, 1500);
      } else {
        Swal.fire({
            title: 'Kurang Tepat',
            text: 'Coba perhatikan kaidah Nahwu-nya lagi',
            icon: 'error',
            timer: 1500,
            showConfirmButton: false
        });
        // Shake effect?
      }
    });
  }
  // Immediate load attempt
  window.loadSentenceGame();
}


/* ==========================================================================
   GAME 3: HARAKAT GAME
   ========================================================================== */
function initHarakatGame() {
  let HARAKAT_DATA = window.HARAKAT_GAME_DATA || [];

  if (!HARAKAT_DATA || !HARAKAT_DATA.length) {
      console.warn("HARAKAT_DATA missing! Using fallback.");
      HARAKAT_DATA = [
          { plain: "كتب", answer: "كَتَبَ" },
          { plain: "قلم", answer: "قَلَمٌ" }
      ];
  } else {
      console.log("Harakat Game Data Loaded:", HARAKAT_DATA.length);
  }

  let currentQuestion = null;

  const questionEl = document.getElementById("sg-harakat-question");
  const inputEl = document.getElementById("sg-harakat-input");
  const checkBtn = document.getElementById("sg-harakat-check");
  const shuffleBtn = document.getElementById("sg-harakat-shuffle");
  const keyboardToggle = document.getElementById("sg-harakat-keyboard-toggle");

  if (!questionEl || !inputEl) return;

  /* --- LOGIK KEYBOARD --- */
  // Reuse logic from global keyboard script via explicit calls or by replicating basic insertion logic
  // Since we injected arabic-keyboard.js, we can assume the DOM exists.
  // We just need to focus this input when keyboard keys are pressed.
  
  // Track active input for keyboard
  inputEl.addEventListener('focus', () => {
    window.activeArabicInput = inputEl; 
  });

  window.loadHarakatGame = function() {
    currentQuestion = HARAKAT_DATA[Math.floor(Math.random() * HARAKAT_DATA.length)];
    questionEl.textContent = currentQuestion.plain;
    inputEl.value = "";
  };

  if(shuffleBtn) shuffleBtn.addEventListener("click", window.loadHarakatGame);

  if(checkBtn) {
    checkBtn.addEventListener("click", () => {
      const user = normalize(inputEl.value);
      const correct = normalize(currentQuestion.answer);

      if (!user) return Swal.fire('Kosong?', 'Isi harakat dulu ya', 'warning');

      if (user === correct) {
        document.getElementById('arabic-keyboard')?.classList.add('hidden'); // Fix: Hide keyboard
        Swal.fire({
            title: 'BENAR!',
            text: '+1 Poin',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false
        });
        saveOnePoint("Harakat Game"); // DATABASE SAVE
        setTimeout(window.loadHarakatGame, 1500);
      } else {
        document.getElementById('arabic-keyboard')?.classList.add('hidden'); // Fix: Hide keyboard
        Swal.fire({
            title: 'Masih Salah',
            text: 'Coba cek lagi ya',
            icon: 'error',
            timer: 1500,
            showConfirmButton: false
        });
      }
    });
  }

  // Keyboard Connection
  if(keyboardToggle) {
    keyboardToggle.addEventListener("click", () => {
      const kb = document.getElementById('arabic-keyboard');
      if(kb) {
        kb.classList.toggle('hidden');
        window.activeArabicInput = inputEl; // Set focus logic
      }
    });

    // Fix: Re-show keyboard when input is clicked/focused again
    inputEl.addEventListener('click', () => {
        const kb = document.getElementById('arabic-keyboard');
        if (kb && kb.classList.contains('hidden')) {
            kb.classList.remove('hidden');
        }
    });
  }

  function normalize(text) {
    return text.trim().replace(/\s+/g, " ").replace(/ـ/g, "");
  }
  
  // Immediate load attempt
  window.loadHarakatGame();
}

// Global Keyboard Helper (if not overlapping with existing one)
document.addEventListener('click', (e) => {
    // Check if key is clicked
    if(e.target.classList.contains('key-harakat') || e.target.classList.contains('key-arab')) {
        const char = e.target.dataset.char;
        if(window.activeArabicInput) {
             // USE SHARED UTILS (DRY Principle)
             insertArabicChar(window.activeArabicInput, char);
        }
    }
});

