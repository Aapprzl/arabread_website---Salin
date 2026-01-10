// assets/js/quiz-page.js

/* =========================
   PAGE CONFIG
========================= */
const quizType =
  document.querySelector("main")?.dataset.quiz || "taaruf";

/* =========================
   LOAD QUIZ DATA DINAMIS
========================= */
async function loadQuizData(type) {
  switch (type) {
    case "school":
      return import("../../bank_data_quiz/quiz-school.js")
        .then(m => m.QUIZ_SCHOOL);

    case "family":
      return import("../../bank_data_quiz/quiz-family.js")
        .then(m => m.QUIZ_FAMILY);

    case "animals":
      return import("../../bank_data_quiz/quiz-animals.js")
        .then(m => m.QUIZ_ANIMALS);

    case "transportation":
      return import("../../bank_data_quiz/quiz-transportation.js")
        .then(m => m.QUIZ_TRANSPORTATION);

    case "taaruf":
    default:
      return import("../../bank_data_quiz/quiz-taaruf.js")
        .then(m => m.QUIZ_TAARUF);
  }
}

/* =========================
   ELEMENT DOM
========================= */
const questionTextEl = document.getElementById("questionText");
const arabicEl = document.getElementById("arabicQuestion");
const optionsEl = document.getElementById("options");
const feedbackEl = document.getElementById("feedback");
const nextBtn = document.getElementById("nextBtn");
const scoreEl = document.getElementById("score");
const resultBox = document.getElementById("results");

/* =========================
   STATE
========================= */
let QUESTIONS = [];
let shuffled = [];
let index = 0;
let score = 0;

/* =========================
   UTIL
========================= */
function shuffleArray(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

/* =========================
   LOAD QUESTION
========================= */
function renderQuestion() {
  feedbackEl.textContent = "";
  nextBtn.classList.add("hidden");
  optionsEl.innerHTML = "";

  const q = shuffled[index];

  questionTextEl.textContent = q.question;
  arabicEl.textContent = q.ar;

  shuffleArray(q.options).forEach(opt => {
    const btn = document.createElement("button");
    btn.textContent = opt;
    btn.className =
      "px-4 py-3 rounded-lg bg-primary-100 hover:bg-primary-200 text-primary-700 font-semibold";
    btn.onclick = () => checkAnswer(btn, q.correct);
    optionsEl.appendChild(btn);
  });
}

/* =========================
   CHECK ANSWER
========================= */
function checkAnswer(button, correct) {
  const buttons = optionsEl.querySelectorAll("button");
  buttons.forEach(b => b.disabled = true);

  if (button.textContent === correct) {
    score++;
    button.classList.add("bg-green-200","text-green-800");
    feedbackEl.textContent = "Benar! 🎉";
    feedbackEl.className = "text-green-600 font-bold";
  } else {
    button.classList.add("bg-red-200","text-red-800");
    feedbackEl.textContent = `Jawaban benar: ${correct}`;
    feedbackEl.className = "text-red-600 font-bold";

    buttons.forEach(b => {
      if (b.textContent === correct) {
        b.classList.add("bg-green-200","text-green-800");
      }
    });
  }

  nextBtn.classList.remove("hidden");
}

/* =========================
   NEXT
========================= */
nextBtn.addEventListener("click", () => {
  index++;
  if (index >= shuffled.length) {
    showResult();
  } else {
    renderQuestion();
  }
});

/* =========================
   RESULT
========================= */
function showResult() {
  optionsEl.innerHTML = "";
  questionTextEl.textContent = "Kuis Selesai";
  arabicEl.textContent = "";

  resultBox.classList.remove("hidden");
  scoreEl.textContent = `${score} / ${shuffled.length}`;
}

/* =========================
   INIT
========================= */
(async function initQuiz() {
  QUESTIONS = await loadQuizData(quizType);
  shuffled = shuffleArray(QUESTIONS);
  renderQuestion();
})();
