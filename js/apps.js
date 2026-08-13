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

// ============================================================
// APP 2 — CSS Unit Converter
// ============================================================
(function unitConverter() {
  const valueInput = document.getElementById("conv-value");
  const baseInput = document.getElementById("conv-base");
  const resultPx = document.getElementById("result-px");
  const resultRem = document.getElementById("result-rem");
  const resultEm = document.getElementById("result-em");

  if (!valueInput) return;

  const ROOT_FONT_SIZE = 16; // standard browser default for the html element

  function update() {
    const px = parseFloat(valueInput.value) || 0;
    const base = parseFloat(baseInput.value) || ROOT_FONT_SIZE;

    resultPx.textContent = px.toString();
    resultRem.textContent = (px / ROOT_FONT_SIZE).toFixed(3).replace(/\.?0+$/, "") || "0";
    resultEm.textContent = (px / base).toFixed(3).replace(/\.?0+$/, "") || "0";
  }

  valueInput.addEventListener("input", update);
  baseInput.addEventListener("input", update);
  update();
})();

// ============================================================
// APP 3 — Palette Generator
// ============================================================
(function paletteGenerator() {
  const generateBtn = document.getElementById("palette-generate");
  const swatchWrap = document.getElementById("palette-swatches");
  const note = document.getElementById("palette-note");

  if (!generateBtn) return;

  function hslToHex(h, s, l) {
    s /= 100;
    l /= 100;
    const k = (n) => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = (n) =>
      l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    const toHex = (x) =>
      Math.round(255 * x).toString(16).padStart(2, "0");
    return `#${toHex(f(0))}${toHex(f(8))}${toHex(f(4))}`;
  }

  function generatePalette() {
    const baseHue = Math.floor(Math.random() * 360);
    // Five stops around the base hue for a related, non-random-looking set
    const offsets = [0, 24, 48, -24, -48];
    return offsets.map((offset, i) => {
      const hue = (baseHue + offset + 360) % 360;
      const lightness = 38 + i * 9; // gradient from darker to lighter
      return hslToHex(hue, 62, lightness);
    });
  }

  function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }
    const temp = document.createElement("textarea");
    temp.value = text;
    document.body.appendChild(temp);
    temp.select();
    document.execCommand("copy");
    document.body.removeChild(temp);
    return Promise.resolve();
  }

  function render(colors) {
    swatchWrap.innerHTML = "";
    colors.forEach((hex) => {
      const swatch = document.createElement("button");
      swatch.type = "button";
      swatch.className = "swatch";
      swatch.style.background = hex;
      swatch.setAttribute("aria-label", `Copy color ${hex}`);
      swatch.innerHTML = `<span class="hex">${hex}</span>`;

      swatch.addEventListener("click", () => {
        copyToClipboard(hex).then(() => {
          note.innerHTML = `<span class="copied">${hex} copied to clipboard.</span>`;
        });
      });

      swatchWrap.appendChild(swatch);
    });
  }

  generateBtn.addEventListener("click", () => {
    render(generatePalette());
    note.textContent = "Click any swatch to copy its hex code.";
  });

  // Show an initial palette on load
  render(generatePalette());
})();


// ============================================================
// APP 4 — Task List (persisted with localStorage)
// ============================================================
(function taskList() {
  const form = document.getElementById("todo-form");
  const input = document.getElementById("todo-input");
  const list = document.getElementById("todo-list");
  const emptyMsg = document.getElementById("todo-empty");
 
  if (!form) return;
 
  const STORAGE_KEY = "web-basics-tasks";
 
  function loadTasks() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (err) {
      return [];
    }
  }
 
  function saveTasks(tasks) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (err) {
      // localStorage might be unavailable (e.g. private browsing) — fail quietly
    }
  }
 
  let tasks = loadTasks();
 
  function render() {
    list.innerHTML = "";
    emptyMsg.classList.toggle("hidden", tasks.length > 0);
 
    tasks.forEach((task, index) => {
      const li = document.createElement("li");
      if (task.done) li.classList.add("done");
 
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = task.done;
      checkbox.setAttribute("aria-label", `Mark "${task.text}" as done`);
      checkbox.addEventListener("change", () => {
        tasks[index].done = checkbox.checked;
        saveTasks(tasks);
        render();
      });
 
      const span = document.createElement("span");
      span.className = "todo-text";
      span.textContent = task.text;
 
      const removeBtn = document.createElement("button");
      removeBtn.type = "button";
      removeBtn.className = "todo-remove";
      removeBtn.innerHTML = "&times;";
      removeBtn.setAttribute("aria-label", `Remove "${task.text}"`);
      removeBtn.addEventListener("click", () => {
        tasks.splice(index, 1);
        saveTasks(tasks);
        render();
      });
 
      li.appendChild(checkbox);
      li.appendChild(span);
      li.appendChild(removeBtn);
      list.appendChild(li);
    });
  }
 
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const text = input.value.trim();
    if (!text) return;
 
    tasks.push({ text, done: false });
    saveTasks(tasks);
    input.value = "";
    render();
  });
 
  render();
})();
 
// ============================================================
// APP 5 — Word Counter
// ============================================================
(function wordCounter() {
  const textarea = document.getElementById("counter-input");
  const wordsEl = document.getElementById("count-words");
  const charsEl = document.getElementById("count-chars");
  const timeEl = document.getElementById("count-time");
 
  if (!textarea) return;
 
  const WORDS_PER_MINUTE = 200; // average adult silent reading speed
 
  function update() {
    const text = textarea.value;
    const trimmed = text.trim();
    const words = trimmed.length ? trimmed.split(/\s+/).length : 0;
    const chars = text.length;
    const minutes = words / WORDS_PER_MINUTE;
 
    wordsEl.textContent = words.toString();
    charsEl.textContent = chars.toString();
 
    if (minutes < 1) {
      timeEl.textContent = `${Math.max(1, Math.round(minutes * 60))}s`;
    } else {
      timeEl.textContent = `${Math.round(minutes)}m`;
    }
  }
 
  textarea.addEventListener("input", update);
  update();
})();