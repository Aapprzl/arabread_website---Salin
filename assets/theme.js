// assets/theme.js
(function () {
  const root = document.documentElement;
  const theme = localStorage.getItem("theme");

  if (theme === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
})();
