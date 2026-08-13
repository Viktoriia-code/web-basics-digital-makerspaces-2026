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

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function updateScrollButton() {
  scrollTopButton.classList.toggle("is-visible", window.scrollY > 400);
}

scrollTopButton.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: prefersReducedMotion.matches ? "auto" : "smooth",
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

// ============================================================
// Hero console typing effect
// ============================================================
const typedLine = document.getElementById("typed-line");

if (typedLine && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const message = "console.log('Hello, welcome to my site.');";
  let i = 0;

  const type = () => {
    if (i <= message.length) {
      typedLine.innerHTML =
        `<span class="tag">${message.slice(0, i)}</span><span class="cursor"></span>`;
      i++;
      setTimeout(type, 45);
    }
  };

  // Start once the browser mock is in view, so it plays on load
  type();
} else if (typedLine) {
  typedLine.innerHTML =
    `<span class="tag">console.log('Hello, welcome to my site.');</span>`;
}