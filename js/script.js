// ============================================================
// Mobile navigation toggle
// ============================================================
const navToggle = document.getElementById("nav-toggle");
const mainNav = document.getElementById("main-nav");

if (navToggle && mainNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("open");
    document.body.classList.toggle("nav-open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  mainNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mainNav.classList.remove("open");
      document.body.classList.remove("nav-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

// ============================================================
// Scroll to top button
// ============================================================
const scrollTopButton = document.createElement("button");
scrollTopButton.type = "button";
scrollTopButton.className = "scroll-top-btn";
scrollTopButton.setAttribute("aria-label", "Scroll to top");
scrollTopButton.innerHTML = "↑";
document.body.appendChild(scrollTopButton);

function updateScrollButton() {
  scrollTopButton.classList.toggle("is-visible", window.scrollY > 400);
}

scrollTopButton.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

window.addEventListener("scroll", updateScrollButton, { passive: true });
updateScrollButton();

// ============================================================
// Footer year
// ============================================================
const yearEl = document.getElementById("year");
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}
