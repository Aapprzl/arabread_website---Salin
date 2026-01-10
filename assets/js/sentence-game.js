/* ===============================
   GAME MENYUSUN KALIMAT
================================ */

document.addEventListener("DOMContentLoaded", () => {

  let currentQuestion = null;

  const wordBank = document.getElementById("word-bank");
  const dropZone = document.getElementById("drop-zone");
  const feedback = document.getElementById("sentence-feedback");
  // Elemen baru untuk judul dan deskripsi
  const levelTitle = document.getElementById("current-level-title");
  const levelDescription = document.getElementById("current-level-description");

  if (!wordBank || !dropZone) {
    console.error("Elemen game tidak ditemukan di DOM");
    return;
  }

  /* ========== INIT GAME ========== */
  initSentenceGame();

  function initSentenceGame() {
    currentQuestion = getRandomQuestion();
    renderQuestion(currentQuestion);
  }

  /* ========== DATA HANDLER ========== */
  function getRandomQuestion() {
    // Mengambil pertanyaan secara acak dari SENTENCE_GAME_DATA
    return SENTENCE_GAME_DATA[
      Math.floor(Math.random() * SENTENCE_GAME_DATA.length)
    ];
  }

  /* ========== RENDER ========== */
  function renderQuestion(question) {
    // 1. Reset Area
    wordBank.innerHTML = "";
    dropZone.innerHTML = "";
    feedback.style.opacity = 0;

    // 2. Update Judul & Deskripsi Gramatikal
    if (levelTitle) levelTitle.textContent = question.title;
    if (levelDescription) levelDescription.textContent = question.description;

    // 3. Shuffle & Render Kata
    const shuffled = [...question.correct].sort(() => Math.random() - 0.5);
    shuffled.forEach(word => wordBank.appendChild(createWord(word)));
  }

  /* ========== WORD ELEMENT ========== */
  function createWord(word) {
    const el = document.createElement("div");
    el.textContent = word;
    el.draggable = true; // Aktifkan draggable

    // Styling (Font Arab diperbesar agar mudah dibaca)
    el.className =
      "px-5 py-2.5 rounded-xl bg-blue-100 dark:bg-blue-900/40 " +
      "text-blue-700 dark:text-blue-300 font-arab text-2xl " +
      "cursor-pointer select-none border-2 border-transparent " +
      "hover:border-blue-400 active:scale-95 transition shadow-sm";

    // Klik untuk pindah (Mobile Friendly)
    el.addEventListener("click", () => {
      if (el.parentElement.id === "word-bank") {
        dropZone.appendChild(el);
      } else {
        wordBank.appendChild(el);
      }
    });

    // Drag support
    el.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", word);
      el.classList.add("opacity-50");
    });

    el.addEventListener("dragend", () => {
      el.classList.remove("opacity-50");
    });

    return el;
  }

  /* ========== DRAG & DROP ========== */
  [wordBank, dropZone].forEach(zone => {
    zone.addEventListener("dragover", e => {
      e.preventDefault();
      zone.classList.add("bg-blue-50/50", "dark:bg-slate-700/50");
    });

    zone.addEventListener("dragleave", () => {
      zone.classList.remove("bg-blue-50/50", "dark:bg-slate-700/50");
    });

    zone.addEventListener("drop", e => {
      e.preventDefault();
      zone.classList.remove("bg-blue-50/50", "dark:bg-slate-700/50");
      
      const wordText = e.dataTransfer.getData("text/plain");
      // Cari elemen yang sedang di-drag berdasarkan textnya
      const el = [...document.querySelectorAll("#word-bank div, #drop-zone div")]
        .find(w => w.textContent === wordText && w.classList.contains('opacity-50'));
      
      if (el) zone.appendChild(el);
    });
  });

  /* ========== CHECK ANSWER ========== */
 /* ========== CHECK ANSWER ========== */
window.checkSentence = function () {
  const userAnswer = [...dropZone.children].map(w => w.textContent);
  const correct = currentQuestion.correct;

  if (userAnswer.length === 0) {
    showFeedback("🤔 Masukkan kata terlebih dahulu", "text-slate-500");
    return;
  }

  const isCorrect = userAnswer.every((w, i) => w === correct[i]) && userAnswer.length === correct.length;

  if (isCorrect) {
    // Memberikan Feedback Pop-up yang Cantik
    Swal.fire({
      title: 'MUMTAZ! (Benar)',
      html: `<div class="text-2xl font-arab mb-2" dir="rtl">${userAnswer.join(' ')}</div>
             <p class="text-sm">Susunan kalimat Anda sudah tepat sesuai kaidah Nahwu.</p>`,
      icon: 'success',
      confirmButtonText: 'Lanjut ke Soal Berikutnya',
      confirmButtonColor: '#2563eb', // Warna Biru
      background: document.documentElement.classList.contains('dark') ? '#1e293b' : '#fff',
      color: document.documentElement.classList.contains('dark') ? '#fff' : '#1e293b',
      timer: 3000,
      timerProgressBar: true,
    }).then((result) => {
      // Pindah ke soal berikutnya setelah pop-up ditutup atau timer habis
      initSentenceGame();
    });

    feedback.style.opacity = 0; // Sembunyikan feedback teks jika benar

  } else {
    // Jika salah, tetap gunakan feedback teks atau bisa juga pakai pop-up kecil
    showFeedback("❌ Kurang tepat, perhatikan kaidah Nahwu-nya", "text-rose-500");
    
    // Efek getar pada zona drop
    dropZone.classList.add("ring-2", "ring-rose-500", "animate-bounce");
    setTimeout(() => {
      dropZone.classList.remove("ring-2", "ring-rose-500", "animate-bounce");
    }, 1000);
  }
};

  /* ========== FEEDBACK ========== */
  function showFeedback(text, color) {
    feedback.textContent = text;
    feedback.className =
      "mt-6 text-center text-lg font-black transition-all duration-300 " + color;
    feedback.style.opacity = 1;
  }

});