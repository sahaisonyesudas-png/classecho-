// Hamburger toggle
const hamburgerBtn = document.getElementById("hamburgerBtn");
const sideMenu = document.getElementById("sideMenu");

hamburgerBtn.addEventListener("click", () => {
  sideMenu.classList.toggle("active");
});

// Close sidebar when clicking outside
document.addEventListener("click", (e) => {
  if (!sideMenu.contains(e.target) && !hamburgerBtn.contains(e.target)) {
    sideMenu.classList.remove("active");
  }
});

// Summary expand/collapse
const summaryDashboard = document.getElementById("summaryDashboard");

summaryDashboard.addEventListener("click", () => {
  summaryDashboard.classList.toggle("expanded");
});
