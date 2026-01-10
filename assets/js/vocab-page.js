// ===============================
// CONFIG
// ===============================
const ITEMS_PER_PAGE = 5;

// ===============================
// DOM
// ===============================
const tableBody = document.querySelector("#vocab-table tbody");
const pagination = document.getElementById("pagination");
const categoryToggle = document.getElementById("categoryToggle");
const categoryMenu = document.getElementById("categoryMenu");

// ===============================
// STATE
// ===============================
let currentCategory = null;
let currentVocabData = [];
let isMenuOpen = false;

// PERCANTIK TAMPILAN KATA
function formatCategoryLabel(key) {
  return key
    // sisipkan spasi sebelum huruf kapital
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    // kapital huruf pertama
    .replace(/^./, str => str.toUpperCase());
}


// ===============================
// CATEGORY MENU
// ===============================
function buildCategoryMenu() {
  if (!categoryMenu) return;

  categoryMenu.innerHTML = "";

  Object.keys(VOCAB_SOURCE).forEach((key) => {
    const btn = document.createElement("button");
    btn.dataset.category = key;
    btn.className =
      "category-item w-full px-4 py-2 text-left text-sm " +
      "hover:bg-emerald-50 dark:hover:bg-emerald-900/30";
    btn.textContent = formatCategoryLabel(key);


    categoryMenu.appendChild(btn);
  });
}

// ===============================
// CATEGORY LOGIC
// ===============================
function highlightActiveCategory(categoryKey) {
  document.querySelectorAll(".category-item").forEach(btn => {
    btn.classList.toggle(
      "category-active",
      btn.dataset.category === categoryKey
    );
  });
}

function setCategory(categoryKey) {
  currentCategory = categoryKey;
  currentVocabData = VOCAB_SOURCE[categoryKey] || [];

  highlightActiveCategory(categoryKey);
  buildPagination();
  renderPage(1);
}

// ===============================
// RENDER TABLE
// ===============================
function renderPage(page) {
  tableBody.innerHTML = "";

  const start = (page - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;

  const pageItems = currentVocabData.slice(start, end);

  pageItems.forEach((item, i) => {
    tableBody.innerHTML += `
<tr>
  <td class="px-6 py-4 text-sm text-slate-400 italic">
    ${start + i + 1}
  </td>

  <td class="px-6 py-4 text-3xl arabic-text text-right font-bold whitespace-nowrap" dir="rtl">
    ${item.arabic}
  </td>

  <td class="px-6 py-4 text-sm italic text-slate-400">
    ${item.latin}
  </td>

  <td class="px-6 py-4 text-sm font-semibold text-emerald-400">
    ${item.meaning}
  </td>
</tr>
`;

  });

  if (typeof buildMobileList === "function") {
    buildMobileList();
  }

  setActive(page);
}

// ===============================
// PAGINATION
// ===============================
function buildPagination() {
  const pages = Math.ceil(currentVocabData.length / ITEMS_PER_PAGE);

  pagination.innerHTML = "";

  if (pages <= 1) {
    pagination.classList.add("hidden");
    updateProgressBar(1, 1);
    return;
  }

  pagination.classList.remove("hidden");

  for (let i = 1; i <= pages; i++) {
    const dot = document.createElement("button");

    dot.className =
      "w-2.5 h-2.5 rounded-full bg-slate-400/40 " +
      "hover:bg-emerald-400 transition";

    dot.dataset.page = i;
    dot.onclick = () => renderPage(i);

    pagination.appendChild(dot);
  }
}

// ----
function updateProgressBar(page, totalPages) {
  const bar = document.getElementById("progressBar");
  if (!bar) return;

  const percent = (page / totalPages) * 100;
  bar.style.width = `${percent}%`;
}


function setActive(page) {
  const dots = [...pagination.children];
  const total = dots.length || 1;

  dots.forEach((dot, idx) => {
    dot.classList.toggle("bg-emerald-500", idx + 1 === page);
    dot.classList.toggle("bg-slate-400/40", idx + 1 !== page);
  });

  updateProgressBar(page, total);
}


// ===============================
// MENU TOGGLE
// ===============================
if (categoryToggle && categoryMenu) {
  categoryToggle.addEventListener("click", (e) => {
    e.stopPropagation();
    isMenuOpen = !isMenuOpen;
    categoryMenu.classList.toggle("hidden", !isMenuOpen);
  });

  document.addEventListener("click", () => {
    if (!isMenuOpen) return;
    isMenuOpen = false;
    categoryMenu.classList.add("hidden");
  });
}

// ===============================
// EVENTS
// ===============================
document.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-category]");
  if (!btn) return;

  setCategory(btn.dataset.category);

  isMenuOpen = false;
  categoryMenu?.classList.add("hidden");
});

// ===============================
// INIT
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  buildCategoryMenu();
  const firstCategory = Object.keys(VOCAB_SOURCE)[0];
  if (firstCategory) {
    setCategory(firstCategory);
  }
});
