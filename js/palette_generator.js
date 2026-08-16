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