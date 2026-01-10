// assets/js/read-page.js

/* =========================
   ELEMENT DOM
========================= */
const readingEl = document.getElementById("readingText");
const translationEl = document.getElementById("translationText");
const audioEl = document.getElementById("readingAudio");

const shuffleBtn = document.getElementById("shuffleReading");
const toggleBtn = document.getElementById("toggleTranslation");
const translationBox = document.getElementById("translation");

/* =========================
   PAGE CONFIG (FROM HTML)
========================= */
const pageType =
  document.querySelector("main")?.dataset.reading || "taaruf";

/* =========================
   LOAD DATA DINAMIS
========================= */
async function loadReadingData(type) {
  switch (type) {
    case "school":
      return import("../../bank_data_read/reading-school.js")
        .then(m => m.READINGS_SCHOOL);

    case "family":
      return import("../../bank_data_read/reading-family.js")
        .then(m => m.READINGS_FAMILY);

    case "animals":
      return import("../../bank_data_read/reading-animals.js")
        .then(m => m.READINGS_ANIMALS);

    case "transportation":
      return import("../../bank_data_read/reading-transportation.js")
        .then(m => m.READINGS_TRANSPORTATION);

    case "taaruf":
    default:
      return import("../../bank_data_read/reading-taaruf.js")
        .then(m => m.READINGS_TAARUF);
  }
}

/* =========================
   RENDER FUNCTION (SINGLE SOURCE)
========================= */
function renderReading(data) {
  if (!data) return;

  readingEl.innerHTML = data.ar;
  translationEl.innerHTML = data.idn;

  audioEl.src = data.audio;
  audioEl.load();

  // reset terjemahan
  translationBox.classList.add("hidden");
  translationBox.setAttribute("aria-hidden", "true");
  toggleBtn.textContent = "Tampilkan Terjemahan";
  toggleBtn.setAttribute("aria-expanded", "false");
}

/* =========================
   INIT APP
========================= */
let READINGS = [];

(async function initReadingPage() {
  try {
    READINGS = await loadReadingData(pageType);

    if (!READINGS || READINGS.length === 0) {
      console.error("Data bacaan kosong:", pageType);
      return;
    }

    // render bacaan pertama
    renderReading(READINGS[0]);
  } catch (err) {
    console.error("Gagal memuat bank bacaan:", err);
  }
})();

/* =========================
   TOGGLE TERJEMAHAN
========================= */
toggleBtn.addEventListener("click", () => {
  const isHidden = translationBox.classList.contains("hidden");

  translationBox.classList.toggle("hidden");
  translationBox.setAttribute("aria-hidden", String(!isHidden));

  toggleBtn.textContent = isHidden
    ? "Sembunyikan Terjemahan"
    : "Tampilkan Terjemahan";

  toggleBtn.setAttribute("aria-expanded", String(isHidden));
});

/* =========================
   SHUFFLE BACAAN
========================= */
shuffleBtn.addEventListener("click", () => {
  if (!READINGS.length) return;

  const randomIndex = Math.floor(Math.random() * READINGS.length);
  renderReading(READINGS[randomIndex]);
});
