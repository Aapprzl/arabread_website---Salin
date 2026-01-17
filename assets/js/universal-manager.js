import { THEME_REGISTRY, fetchThemes } from "./content-registry.js";
import { db, collection, query, where, getDocs } from "./firebase-config.js";

// ==========================================
// UNIVERSAL ENGINE
// Mesin 'Satu untuk Semua' Material
// ==========================================

async function getTheme() {
  const urlParams = new URLSearchParams(window.location.search);
  const THEME_ID = urlParams.get("theme") || "taaruf";

  // Ensure we have latest themes
  await fetchThemes();

  return { theme: THEME_REGISTRY[THEME_ID], id: THEME_ID };
}

// ==========================================
// 1. VOCABULARY ENGINE
// ==========================================
// ==========================================
// 1. VOCABULARY ENGINE
// ==========================================
export async function initVocabPage() {
  const { theme: CURRENT_THEME, id: THEME_ID } = await getTheme();

  if (!CURRENT_THEME) {
    alert("Tema tidak ditemukan!");
    window.location.href = "index.html";
    return;
  }

  updateVocabUI(CURRENT_THEME, THEME_ID);

  let data = [];

  if (CURRENT_THEME.source === "firestore") {
    data =
      typeof CURRENT_THEME.vocabData === "string"
        ? JSON.parse(CURRENT_THEME.vocabData)
        : CURRENT_THEME.vocabData || [];
  } else {
    // 1. Try Fetching from FLASHCARDS collection (New System)
    let firestoreVocabs = [];
    try {
       // Filter by tema. Jika tema tidak ketemu, mungkin perlu filter 'vocabFilter' dari registry
       const filterKey = CURRENT_THEME.vocabFilter || THEME_ID;
       const q = query(collection(db, "flashcards"), where("tema", "==", filterKey));
       const snap = await getDocs(q);
       snap.forEach(d => firestoreVocabs.push(d.data()));
    } catch(e) {
       console.warn("Firestore vocab fetch error:", e);
    }

    if (firestoreVocabs.length > 0) {
       data = firestoreVocabs;
    }
  }

  renderVocabTable(data);
}

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = src;
    s.onload = resolve;
    s.onerror = reject;
    document.head.appendChild(s);
  });
}

function updateVocabUI(theme, id) {
  document.title = `Kosakata Tema ${theme.title} | Tarbiyyat Al-Lughah`;

  // Header & Hero
  setText("hero-ar-title", theme.arTitle);
  setText("hero-id-title", theme.title);
  setText("footer-theme-name", theme.arTitle);

  // Nav Links
  setHref("nav-read", `reading.html?theme=${id}`);
  setHref("nav-quiz", `quiz.html?theme=${id}`);
  setHref("btn-next-read", `reading.html?theme=${id}`);
  setHref("btn-next-quiz", `quiz.html?theme=${id}`);

  // Mobile Nav
  setHref("mobile-nav-read", `reading.html?theme=${id}`);
  setHref("mobile-nav-quiz", `quiz.html?theme=${id}`);

  // Dynamic Color Injection
  if (theme.color && theme.color !== "emerald") {
    applyThemeColor(theme.color);
  }
  revealPage();
}

function applyThemeColor(color) {
  const all = document.querySelectorAll("*");
  all.forEach((el) => {
    el.classList.forEach((cls) => {
      // Replace Emerald (Default) OR Amber (Quiz Default)
      if (cls.includes("emerald")) {
        const newCls = cls.replace("emerald", color);
        el.classList.replace(cls, newCls);
      } else if (cls.includes("amber")) {
        const newCls = cls.replace("amber", color);
        el.classList.replace(cls, newCls);
      }
    });
  });
}

function revealPage() {
  // Remove opacity-0 to fade in the page
  document.body.classList.remove("opacity-0");
}

function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function setHref(id, url) {
  const el = document.getElementById(id);
  if (el) el.href = url;
}

function renderVocabTable(data) {
  const tableBody = document.querySelector("#vocab-table tbody");

  if (!tableBody) return;
  if (data.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="4" class="text-center py-8 text-slate-400">Belum ada data kosakata.</td></tr>`;
    return;
  }

  const ITEMS_PER_PAGE = 10;

  function render(page) {
    tableBody.innerHTML = "";
    const start = (page - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    const slice = data.slice(start, end);

    slice.forEach((item, i) => {
      // Data Mapping
      const mufrod = item.ar || item.arabic || "?";
      const jamak = item.jamak || item.pl || "-";
      const meaning = item.arti || item.mean || item.idn || item.makna || "";

      tableBody.innerHTML += `
        <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
          <td class="px-6 py-4 text-sm text-slate-500 dark:text-slate-400 font-bold">${
            start + i + 1
          }</td>
          <!-- JAMAK (Column 2) -->
          <td class="px-6 py-4 text-3xl arabic-text text-right font-bold text-slate-600 dark:text-slate-400" dir="rtl">${jamak}</td>
          <!-- MUFROD (Column 3) -->
          <td class="px-6 py-4 text-3xl arabic-text text-right font-bold text-slate-800 dark:text-slate-200" dir="rtl">${mufrod}</td>
          <!-- ARTI (Column 4) -->
          <td class="px-6 py-4 text-sm font-bold text-slate-700 dark:text-slate-300">
             ${meaning}
          </td>
        </tr>
      `;
    });

    updatePagination(page, Math.ceil(data.length / ITEMS_PER_PAGE), render);
    renderMobile(data.slice(start, end));
  }

  function renderMobile(slice) {
    const mobileContainer = document.getElementById("mobile-list");
    if (!mobileContainer) return;

    mobileContainer.innerHTML = "";
    slice.forEach((item, i) => {
      const mufrod = item.ar || item.arabic || "?";
      const jamak = item.jamak || item.pl || "";
      const meaning = item.arti || item.mean || item.idn || item.makna || "";
      // const baca = item.baca || ''; // Not available in data loop

      mobileContainer.innerHTML += `
        <div class="bg-white dark:bg-slate-800 rounded-[1.5rem] p-6 border border-slate-50 dark:border-slate-700 shadow-[0_2px_20px_rgba(0,0,0,0.03)] mb-4 relative hover:shadow-lg transition-shadow duration-300">
           
           <div class="flex justify-between items-start mb-6 w-full">
              <!-- Rank (Top Left) -->
              <span class="text-sm font-bold text-slate-300 dark:text-slate-600 font-sans">#${
                i + 1
              }</span>
              
              <!-- Arabic (Top Right) -->
              <div class="text-right flex-1 pl-4">
                 <div class="arabic-text text-5xl font-bold text-slate-800 dark:text-slate-100 leading-tight" dir="rtl">${mufrod}</div>
                 
                 ${
                   jamak && jamak !== "-"
                     ? `
                 <div class="flex items-center justify-end gap-2 mt-6">
                    <span class="text-[10px] text-slate-300 font-bold uppercase tracking-wider">Jamak</span>
                    <div class="arabic-text text-2xl text-slate-400 dark:text-slate-500" dir="rtl">${jamak}</div>
                 </div>
                 `
                     : ""
                 }
              </div>
           </div>

           <!-- Meaning (Bottom Left) -->
           <div class="text-left border-t border-dashed border-slate-100 dark:border-slate-700/50 pt-4 mt-2">
              <h3 class="text-lg font-bold text-slate-700 dark:text-slate-200 leading-tight">${meaning}</h3>
           </div>

        </div>
         `;
    });
  }

  render(1);
}

function updatePagination(page, totalPages, renderFn) {
  const pagination = document.getElementById("pagination");
  if (!pagination) return;
  pagination.innerHTML = "";

  if (page > 1) {
    const btn = document.createElement("button");
    btn.textContent = "←";
    btn.className =
      "px-3 py-1 rounded bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:text-white";
    btn.onclick = () => renderFn(page - 1);
    pagination.appendChild(btn);
  }

  const info = document.createElement("span");
  info.className = "px-3 py-1 text-slate-500 text-sm font-bold";
  info.textContent = `Hal ${page} / ${totalPages}`;
  pagination.appendChild(info);

  if (page < totalPages) {
    const btn = document.createElement("button");
    btn.textContent = "→";
    btn.className =
      "px-3 py-1 rounded bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:text-white";
    btn.onclick = () => renderFn(page + 1);
    pagination.appendChild(btn);
  }
}

// Dummy Play Sound
window.playSound = (text) => {
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "ar-SA";
  window.speechSynthesis.speak(utter);
};

// ==========================================
// 2. READING ENGINE
// ==========================================
// ==========================================
// 2. READING ENGINE
// ==========================================
export async function initReadingPage() {
  const { theme: CURRENT_THEME, id: THEME_ID } = await getTheme();

  if (!CURRENT_THEME) {
    alert("Tema tidak ditemukan!");
    window.location.href = "index.html";
    return;
  }

  // 1. UPDATE UI TEXTS & LINKS
  document.title = `${CURRENT_THEME.title} | Membaca Teks Bahasa Arab`;

  setText("hero-ar-title", CURRENT_THEME.arTitle);
  setText("hero-id-title", CURRENT_THEME.title);
  setText("footer-theme-name", CURRENT_THEME.arTitle);

  setHref("nav-back-vocab", `vocabulary.html?theme=${THEME_ID}`);
  setHref("nav-quiz-top", `quiz.html?theme=${THEME_ID}`);
  setHref("btn-next-vocab", `vocabulary.html?theme=${THEME_ID}`);
  setHref("btn-next-quiz", `quiz.html?theme=${THEME_ID}`);

  // Mobile Nav
  setHref("mobile-nav-vocab", `vocabulary.html?theme=${THEME_ID}`);
  setHref("mobile-nav-quiz", `quiz.html?theme=${THEME_ID}`);

  if (CURRENT_THEME.color && CURRENT_THEME.color !== "emerald") {
    applyThemeColor(CURRENT_THEME.color);
  }
  revealPage();

  // 2. LOAD DATA
  const readingTextEl = document.getElementById("readingText");
  const translationTextEl = document.getElementById("translationText");
  const audioEl = document.getElementById("readingAudio");

  try {
    let data = [];
    if (CURRENT_THEME.source === "firestore") {
      data =
        typeof CURRENT_THEME.readData === "string"
          ? JSON.parse(CURRENT_THEME.readData)
          : CURRENT_THEME.readData || [];
    } else {
      const module = await import(CURRENT_THEME.readModule);
      data = module[CURRENT_THEME.readExport];
    }

    if (!data || data.length === 0) {
      if (readingTextEl) readingTextEl.innerHTML = "❌ Data bacaan kosong.";
      return;
    }

    // 3. RENDER FUNCTION
    let currentIdx = 0;

    function showReading(idx) {
      const item = data[idx];
      if (!item) return;

      // Handle if item is just a string (simple sentence) vs object
      let arText = "";
      let idnText = "";
      let audioSrc = "";

      if (typeof item === "string") {
        arText = item;
        idnText = "(Terjemahan tidak tersedia)";
      } else {
        arText = item.ar || item.arabic || item.text || "?";
        idnText =
          item.idn ||
          item.arti ||
          item.mean ||
          item.trans ||
          "(Terjemahan tidak tersedia)";
        audioSrc = item.audio || "";
      }

      // Text
      if (readingTextEl) readingTextEl.innerHTML = arText;
      if (translationTextEl) translationTextEl.innerHTML = idnText;

      // Audio
      if (audioEl) {
        if (audioSrc) {
          audioEl.src = audioSrc;
          audioEl.style.display = "block";
        } else {
          audioEl.style.display = "none"; // Hide if no audio
        }
      }
    }

    // Initial Load
    showReading(0);

    // 4. BIND CONTROLS
    // Toggle Translation
    const btnTranslate = document.getElementById("toggleTranslation");
    const transBox = document.getElementById("translation");
    if (btnTranslate && transBox) {
      btnTranslate.onclick = () => {
        transBox.classList.toggle("hidden");
        const isHidden = transBox.classList.contains("hidden");
        btnTranslate.textContent = isHidden ? "Terjemahan" : "Sembunyikan";
      };
    }

    // Shuffle
    const btnShuffle = document.getElementById("shuffleReading");
    if (btnShuffle) {
      btnShuffle.onclick = () => {
        if (data.length <= 1) {
            // Feedback visual jika data cuma 1
            btnShuffle.classList.add("animate-shake");
            setTimeout(()=>btnShuffle.classList.remove("animate-shake"), 500);
            return; 
        }

        let rand = Math.floor(Math.random() * data.length);
        // Pastikan tidak sama dengan yang sekarang
        while(rand === currentIdx) {
            rand = Math.floor(Math.random() * data.length);
        }
        
        currentIdx = rand;
        showReading(rand);
        
        // Reset translation view
        if (transBox) transBox.classList.add("hidden");
        if (btnTranslate) btnTranslate.textContent = "Terjemahan";
      };
    }
  } catch (e) {
    console.error(e);
    if (readingTextEl)
      readingTextEl.innerHTML = "❌ Gagal memuat modul bacaan.";
  }
}

// ==========================================
// 3. QUIZ ENGINE
// ==========================================
// ==========================================
// 3. QUIZ ENGINE
// ==========================================
export async function initQuizPage() {
  const { theme: CURRENT_THEME, id: THEME_ID } = await getTheme();

  if (!CURRENT_THEME) {
    alert("Tema tidak ditemukan!");
    window.location.href = "index.html";
    return;
  }

  // 1. UPDATE UI TEXTS & LINKS
  document.title = `Kuis Tema ${CURRENT_THEME.title} | Tarbiyyat Al-Lughah`;

  setText("hero-ar-title", CURRENT_THEME.arTitle);
  // Unlike others, quiz hero only has AR title and static "Kuis Pemahaman Teks"
  setText("footer-theme-name", CURRENT_THEME.arTitle);

  setHref("nav-back-read", `reading.html?theme=${THEME_ID}`);
  setHref("nav-read-top", `reading.html?theme=${THEME_ID}`);
  setHref("btn-next-vocab", `vocabulary.html?theme=${THEME_ID}`);
  setHref("btn-next-read", `reading.html?theme=${THEME_ID}`);

  // Mobile Nav
  setHref("mobile-nav-vocab", `vocabulary.html?theme=${THEME_ID}`);
  setHref("mobile-nav-read", `reading.html?theme=${THEME_ID}`);

  if (CURRENT_THEME.color && CURRENT_THEME.color !== "emerald") {
    applyThemeColor(CURRENT_THEME.color);
  }
  revealPage();

  // 2. LOAD DATA
  const questionTextEl = document.getElementById("questionText");

  try {
    let QUESTIONS = [];
    if (CURRENT_THEME.source === "firestore") {
      QUESTIONS =
        typeof CURRENT_THEME.quizData === "string"
          ? JSON.parse(CURRENT_THEME.quizData)
          : CURRENT_THEME.quizData || [];
    } else {
      const module = await import(CURRENT_THEME.quizModule);
      QUESTIONS = module[CURRENT_THEME.quizExport];
    }

    if (!QUESTIONS || QUESTIONS.length === 0) {
      if (questionTextEl)
        questionTextEl.innerHTML = "❌ Data kuis kosong / belum dibuat.";
      return;
    }

    // VALIDATION: Check if it looks like a quiz (must have 'question' or 'title' that serves as question)
    const sample = QUESTIONS[0];
    if (!sample.question && !sample.ar && !sample.soal) {
      console.warn("Suspicious Quiz Data:", sample);
      console.warn("This might be Vocabulary data pasted into Quiz field?");
    }

    // 3. GAME STATE (ENDLESS MODE)
    // No score, no result screen. Just random questions forever.

    function renderRandomQuestion() {
      // Pick random
      const qIndex = Math.floor(Math.random() * QUESTIONS.length);
      const q = QUESTIONS[qIndex];

      // Shuffle Options if available
      let opts = [];
      if (q.options) {
        opts = [...q.options].sort(() => Math.random() - 0.5);
      }

      // Update UI
      // Hide progress or make it decorative
      setText("quiz-progress", `Latihan Soal Acak`);

      // Handle varying key names
      const qText = q.question || q.soal || q.ar || "Pertanyaan?";
      const arText = q.ar || ""; // If separate arabic text exists

      setText("questionText", qText);
      setText("arabicQuestion", arText); // Might be same as question if only AR provided

      // RESOLVE CORRECT ANSWER (Letter -> Text)
      // Database saves "A", "B", "C", "D". We need to find the text at that index.
      let correctText = q.correct;
      const letterMap = { 'A': 0, 'B': 1, 'C': 2, 'D': 3 };
      
      if (q.options && letterMap.hasOwnProperty(q.correct)) {
         const idx = letterMap[q.correct];
         if (q.options[idx]) {
            correctText = q.options[idx];
         }
      }

      const optionsContainer = document.getElementById("options");
      if (optionsContainer && opts.length > 0) {
        optionsContainer.innerHTML = opts
          .map(
            (opt) => {
               // Escape quotes for the onclick attribute
               const safeOpt = opt.replace(/'/g, "\\'");
               const safeCorrect = correctText.replace(/'/g, "\\'");
               
               return `
               <button onclick="window.checkAnswer('${safeOpt}', '${safeCorrect}', this)" 
                 class="quiz-opt w-full text-left bg-slate-50 dark:bg-slate-700/50 hover:bg-amber-50 dark:hover:bg-amber-900/20 
                        border-2 border-slate-200 dark:border-slate-600 hover:border-amber-400 dark:hover:border-amber-500
                        text-slate-700 dark:text-slate-200 font-bold text-xl font-arabic p-4 rounded-xl transition-all">
                 ${opt}
               </button>
             `;
            }
          )
          .join("");
      }

      // Reset Feedback
      const fbEntry = document.getElementById("feedback");
      if (fbEntry) fbEntry.innerHTML = "";

      const nextBtn = document.getElementById("nextBtn");
      if (nextBtn) {
        nextBtn.classList.add("hidden");
        // Re-bind click for next question
        nextBtn.onclick = () => {
          renderRandomQuestion();
        };
      }
    }

    window.checkAnswer = (val, correct, btn) => {
      const allBtns = document.querySelectorAll(".quiz-opt");

      // DISABLE ALL - One chance only!
      allBtns.forEach((b) => (b.disabled = true));

      const fbEntry = document.getElementById("feedback");
      const nextBtn = document.getElementById("nextBtn");

      if (val === correct) {
        // BENAR
        // score++; // No score needed for endless mode
        btn.classList.add(
          "bg-green-100",
          "border-green-500",
          "text-green-700",
          "dark:bg-green-900/50",
          "dark:text-green-300",
          "dark:border-green-500"
        );
        btn.classList.remove("bg-slate-50", "border-slate-200");
        if (fbEntry)
          fbEntry.innerHTML =
            "<span class='text-green-600 dark:text-green-400 font-bold text-lg'>✅ Mumtaz! Benar!</span>";
      } else {
        // SALAH
        btn.classList.add(
          "bg-red-100",
          "border-red-500",
          "text-red-700",
          "dark:bg-red-900/50",
          "dark:text-red-300",
          "dark:border-red-500"
        );
        btn.classList.remove("bg-slate-50", "border-slate-200");
        if (fbEntry)
          fbEntry.innerHTML = `<div class='text-red-600 dark:text-red-400 font-bold'>❌ Kurang tepat.</div><div class='text-sm text-slate-500'>Jawaban: ${correct}</div>`;

        // Highlight correct one so they learn
        allBtns.forEach((b) => {
          if (b.innerText.trim() === correct) {
            b.classList.add(
              "bg-green-50",
              "border-green-400",
              "text-green-700",
              "dark:bg-green-900/30",
              "dark:text-green-300"
            );
          }
        });
      }

      // Show Next Button (Always show next, because it's endless random)
      if (nextBtn) {
        nextBtn.classList.remove("hidden");
        nextBtn.onclick = () => {
          renderRandomQuestion(); // Use random generator
        };
      }
    };

    // Initial Render
    renderRandomQuestion();
  } catch (e) {
    console.error(e);
    if (questionTextEl)
      questionTextEl.innerHTML = "❌ Gagal memuat modul kuis.";
  }
}

// ==========================================
// 4. AUTO-INITIALIZER (ROUTER)
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  const path = window.location.pathname;

  // GLOBAL: Mobile Menu Handler
  const mobileBtn = document.getElementById("mobile-menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");
  if (mobileBtn && mobileMenu) {
    mobileBtn.addEventListener("click", () => {
      mobileMenu.classList.toggle("hidden");
    });
  }

  if (path.includes("vocabulary.html")) {
    initVocabPage();
  } else if (path.includes("reading.html")) {
    initReadingPage();
  } else if (path.includes("quiz.html")) {
    initQuizPage();
  }
});
