// // ===============================
// // QUIZ TA'ARUF (MODULE VERSION)
// // ===============================

// import { addDoc, collection, serverTimestamp }
//   from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// import {
//   doc,
//   updateDoc,
//   increment
// } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// /* ===============================
//    AMBIL CONTEXT GLOBAL
// ================================ */
// const { db, getCurrentUser } = window.__APP_CONTEXT__;


// // ===============================
// // GENERATE QUIZ DARI VOCABS
// // ===============================

// // ambil vocab tema taaruf
// const sourceVocabs = window.VOCABS.filter(v => v.tema === "taaruf");

// // helper acak array
// function shuffle(arr) {
//   return [...arr].sort(() => Math.random() - 0.5);
// }

// // generate quizData otomatis
// const quizData = sourceVocabs.map(vocab => {
//   // jawaban benar
//   const correctAnswer = vocab.id;

//   // ambil 3 jawaban salah
//   const wrongAnswers = shuffle(
//     sourceVocabs
//       .filter(v => v.id !== correctAnswer)
//       .map(v => v.id)
//   ).slice(0, 3);

//   const options = shuffle([correctAnswer, ...wrongAnswers]);

//   return {
//     question: `Apa arti dari "${vocab.ar}"?`,
//     options,
//     correct: options.indexOf(correctAnswer)
//   };
// });


// /* ===============================
//    VARIABEL
// ================================ */
// let currentQuestion = 0;
// let score = 0;

// let totalTime = 30;       // waktu total kuis
// let timeLeft = totalTime;
// let penaltyTime = 5;     // hukuman salah
// let timerInterval = null;


// /* ===============================
//    ELEMEN
// ================================ */
// const btnStartQuiz = document.getElementById("btnStartQuiz");
// const quizBox = document.getElementById("quizBox");
// const quizQuestion = document.getElementById("quizQuestion");
// const quizOptions = document.getElementById("quizOptions");
// const quizFeedback = document.getElementById("quizFeedback");
// const nextQuestionBtn = document.getElementById("nextQuestion");

// /* ===============================
//    TIMER
// ================================ */
// const timerEl = document.createElement("p");
// timerEl.className = "mb-3 font-semibold text-red-500";
// quizBox.prepend(timerEl);

// /* ===============================
//    MULAI
// ================================ */
// btnStartQuiz.addEventListener("click", () => {
//   score = 0;
//   currentQuestion = 0;

//   btnStartQuiz.classList.add("hidden");
//   quizBox.classList.remove("hidden");

//   startGlobalTimer(); // ✅ BENAR
//   loadQuestion();
// });




// /* ===============================
//    TIMER LOGIC
// ================================ */
// function startGlobalTimer() {
//   timeLeft = totalTime;
//   timerEl.textContent = `⏱️ Waktu: ${timeLeft} detik`;

//   timerInterval = setInterval(() => {
//     timeLeft--;
//     timerEl.textContent = `⏱️ Waktu: ${timeLeft} detik`;

//     if (timeLeft <= 0) {
//       clearInterval(timerInterval);
//       finishQuiz();
//     }
//   }, 1000);
// }


// /* ===============================
//    LOAD SOAL
// ================================ */
// function loadQuestion() {
//   quizFeedback.textContent = "";
//   nextQuestionBtn.classList.add("hidden");

//   const q = quizData[currentQuestion];
//   if (!q) {
//     finishQuiz();
//     return;
//   }

//   quizQuestion.textContent = q.question;
//   quizOptions.innerHTML = "";

//   q.options.forEach((opt, idx) => {
//     const btn = document.createElement("button");
//     btn.textContent = opt;
//     btn.className =
//       "w-full text-left border rounded-lg px-4 py-2 hover:bg-blue-100 dark:hover:bg-slate-600";
//     btn.onclick = () => checkAnswer(idx);
//     quizOptions.appendChild(btn);
//   });
// }


// /* ===============================
//    CEK JAWABAN
// ================================ */
// function checkAnswer(idx) {
//   const correctIndex = quizData[currentQuestion].correct;

//   if (idx === correctIndex) {
//     score++;
//     quizFeedback.textContent = "✅ Benar!";
//     quizFeedback.className = "text-green-400";
//   } else {
//     timeLeft -= penaltyTime;

//     if (timeLeft < 0) timeLeft = 0;
//     timerEl.textContent = timeLeft;

//     quizFeedback.textContent = `❌ Salah! Waktu -${penaltyTime} detik`;
//     quizFeedback.className = "text-red-400";

//     if (timeLeft <= 0) {
//       clearInterval(timerInterval);
//       finishQuiz();
//       return;
//     }
//   }

//   nextQuestionBtn.classList.remove("hidden");
// }


// /* ===============================
//    NEXT
// ================================ */
// nextQuestionBtn.onclick = () => {
//   currentQuestion++;
//   currentQuestion < quizData.length ? loadQuestion() : finishQuiz();
// };

// /* ===============================
//    SIMPAN NILAI
// ================================ */
// async function finishQuiz() {
//   clearInterval(timerInterval);

//   quizQuestion.textContent = "🎉 Kuis selesai!";
//   quizOptions.innerHTML = "";
//   timerEl.textContent = "";

//   quizFeedback.textContent = `Skor: ${score} / ${quizData.length}`;
//   quizFeedback.className = "mt-4 font-bold text-blue-600";


//   const user = getCurrentUser();
//   if (!user) return;

//   // ================= HITUNG POIN =================
//   const benar = score;
//   const salah = quizData.length - score;

//   // aturan poin
//   // benar = 2 poin
//   // salah = 1 poin
//   const poinDidapat = (benar * 2) + (salah * 1);


//   await addDoc(collection(db, "quizResults"), {
//     uid: user.uid,
//     nama: document.getElementById("nama").textContent,
//     kelas: document.getElementById("kelas").textContent,
//     quizId: "taaruf-1",
//     quizTitle: "Kuis Ta’aruf",
//     skor: score,
//     totalSoal: quizData.length,
//     benar: benar,
//     poin: poinDidapat,
//     createdAt: serverTimestamp()
//   });


//   // ================= UPDATE TOTAL POIN SISWA =================
//   await updateDoc(doc(db, "users", user.uid), {
//   poin: increment(poinDidapat),
//   poinTotal: increment(poinDidapat)
//   });


//   console.log("✅ quizResults tersimpan");
// }

// // PEMBUAT SOAL
// function generateQuizFromVocabs(tema, jumlahSoal = 10) {
//   const vocabTema = window.VOCABS.filter(v => v.tema === tema);

//   if (vocabTema.length < 4) {
//     alert("Data vocab kurang untuk membuat kuis");
//     return [];
//   }

//   // Acak vocab
//   const shuffled = vocabTema.sort(() => 0.5 - Math.random());
//   const selected = shuffled.slice(0, jumlahSoal);

//   return selected.map(vocab => {
//     // Ambil 3 jawaban salah
//     const distractors = vocabTema
//       .filter(v => v.id !== vocab.id)
//       .sort(() => 0.5 - Math.random())
//       .slice(0, 3)
//       .map(v => v.id);

//     // Gabung + acak
//     const options = [...distractors, vocab.id].sort(() => 0.5 - Math.random());

//     return {
//       question: `Apa arti dari: ${vocab.ar} ?`,
//       options,
//       correct: options.indexOf(vocab.id)
//     };
//   });
// }
