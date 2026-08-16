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