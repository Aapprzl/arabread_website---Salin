/* =====================================
   GAME HARAKAT — LOGIC (FINAL FIX)
===================================== */

document.addEventListener("DOMContentLoaded", () => {

  /* =====================
     ELEMENTS
  ===================== */
  const questionEl = document.getElementById("harakat-question");
  const inputEl = document.getElementById("harakat-input");
  const feedbackEl = document.getElementById("harakat-feedback");
  const keyboardEl = document.getElementById("arabic-keyboard");
  const toggleKeyboardBtn = document.getElementById("toggle-keyboard");
  const shuffleBtn = document.getElementById("shuffle-question");

  if (!questionEl || !inputEl) {
    console.warn("Game Harakat: elemen DOM tidak lengkap");
    return;
  }

  /* =====================
     HARAKAT GROUP
  ===================== */
  const HARAKAT_GROUPS = {
    vowel: ["َ", "ِ", "ُ", "ً", "ٍ", "ٌ"],
    sukun: ["ْ"],
    shadda: ["ّ"]
  };

  function getHarakatType(char) {
    for (const type in HARAKAT_GROUPS) {
      if (HARAKAT_GROUPS[type].includes(char)) {
        return type;
      }
    }
    return null;
  }

  function isHarakat(char) {
    return /[\u064B-\u0652]/.test(char);
  }

  /* =====================
     STATE
  ===================== */
  let currentQuestion = null;

  /* =====================
     INIT
  ===================== */
  initHarakatGame();

  function initHarakatGame() {
    currentQuestion = getRandomQuestion();
    questionEl.textContent = currentQuestion.plain;
    inputEl.value = "";
    hideFeedback();
  }

  shuffleBtn?.addEventListener("click", () => {
    initHarakatGame();
  });

  function getRandomQuestion() {
    return HARAKAT_GAME_DATA[
      Math.floor(Math.random() * HARAKAT_GAME_DATA.length)
    ];
  }

  /* =====================
     KEYBOARD TOGGLE
  ===================== */
  toggleKeyboardBtn?.addEventListener("click", () => {
    keyboardEl?.classList.toggle("hidden");
  });

  /* =====================
     INSERT CHAR (CORE)
  ===================== */
  function insertChar(char) {
    const value = inputEl.value;
    const harakatType = getHarakatType(char);

    // Huruf biasa
    if (!harakatType) {
      inputEl.value += char;
      inputEl.focus();
      return;
    }

    let i = value.length - 1;

    // Lewati harakat
    while (i >= 0 && isHarakat(value[i])) i--;

    if (i < 0) return;

    const base = value.slice(0, i + 1);
    let harakat = value.slice(i + 1);

    // === ATURAN BAHASA ARAB ===

    if (harakatType === "sukun") {
      // Sukun → hapus semua vokal & tanwin
      harakat = harakat
        .split("")
        .filter(h => getHarakatType(h) === "shadda")
        .join("");

    } else if (harakatType === "vowel") {
      // Vokal → hapus sukun & vokal lain
      harakat = harakat
        .split("")
        .filter(h => getHarakatType(h) === "shadda")
        .join("");
    }

    // Hapus harakat sejenis (dobel klik)
    harakat = harakat
      .split("")
      .filter(h => h !== char)
      .join("");

    inputEl.value = base + harakat + char;
    inputEl.focus();
  }


  /* =====================
     KEYBOARD CLICK (DELEGATION)
  ===================== */
  keyboardEl?.addEventListener("click", (e) => {
    const btn = e.target.closest(".key-harakat, .key-arab");
    if (!btn) return;
    insertChar(btn.dataset.char);
  });

  document.getElementById("key-space")?.addEventListener("click", () => {
    insertChar(" ");
  });

  document.getElementById("key-backspace")?.addEventListener("click", () => {
    inputEl.value = inputEl.value.slice(0, -1);
    inputEl.focus();
  });

  document.getElementById("key-enter")?.addEventListener("click", () => {
    window.checkHarakatAnswer();
  });

  /* =====================
     CHECK ANSWER
  ===================== */
  window.checkHarakatAnswer = function () {
    const user = normalize(inputEl.value);
    const correct = normalize(currentQuestion.answer);

    if (!user) {
      showFeedback("❗ Jawaban masih kosong", "text-amber-500");
      return;
    }

    if (user === correct) {
      showCorrectPopup();

      setTimeout(() => {
        hideCorrectPopup();
        initHarakatGame();
      }, 1400);

      return;
    }

    else {
      showFeedback("❌ Harakat masih salah, coba lagi", "text-rose-500");
    }
  };

  function normalize(text) {
    return text.trim().replace(/\s+/g, " ").replace(/ـ/g, "");
  }

  function showFeedback(text, color) {
    feedbackEl.textContent = text;
    feedbackEl.className =
      "mt-6 text-center text-lg font-black transition " + color;
    feedbackEl.style.opacity = 1;
  }

  function hideFeedback() {
    feedbackEl.style.opacity = 0;
  }

});

// CEK JAWABAN POP UP
const correctPopup = document.getElementById("harakat-correct-popup");

function showCorrectPopup() {
  correctPopup.classList.add("active");
}

function hideCorrectPopup() {
  correctPopup.classList.remove("active");
}

