// ============================================================
// APP 1 — Focus Timer
// ============================================================
(function focusTimer() {
  const display = document.getElementById("timer-display");
  const progress = document.getElementById("timer-progress");
  const startBtn = document.getElementById("timer-start");
  const resetBtn = document.getElementById("timer-reset");
  const status = document.getElementById("timer-status");
  const modeButtons = document.querySelectorAll(".mode-btn");

  if (!display || !startBtn) return;

  const CIRCUMFERENCE = 433.5; // 2 * PI * 69, matches the SVG radius
  let totalSeconds = 25 * 60;
  let remaining = totalSeconds;
  let intervalId = null;
  let running = false;

  function formatTime(seconds) {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = Math.floor(seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }

  function render() {
    display.textContent = formatTime(remaining);
    const fraction = remaining / totalSeconds;
    progress.style.strokeDashoffset = String(CIRCUMFERENCE * (1 - fraction));
  }

  function tick() {
    remaining -= 1;
    if (remaining <= 0) {
      remaining = 0;
      render();
      stop();
      status.textContent = "Time's up — take a breath.";
      return;
    }
    render();
  }

  function start() {
    running = true;
    startBtn.textContent = "Pause";
    status.textContent = "Focus mode on.";
    intervalId = setInterval(tick, 1000);
  }

  function stop() {
    running = false;
    startBtn.textContent = "Start";
    clearInterval(intervalId);
  }

  startBtn.addEventListener("click", () => {
    if (running) {
      stop();
      status.textContent = "Paused.";
    } else {
      if (remaining <= 0) remaining = totalSeconds;
      start();
    }
  });

  resetBtn.addEventListener("click", () => {
    stop();
    remaining = totalSeconds;
    status.textContent = "Ready when you are.";
    render();
  });

  modeButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      modeButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      stop();
      totalSeconds = Number(btn.dataset.minutes) * 60;
      remaining = totalSeconds;
      status.textContent = "Ready when you are.";
      render();
    });
  });

  progress.style.strokeDasharray = String(CIRCUMFERENCE);
  render();
})();