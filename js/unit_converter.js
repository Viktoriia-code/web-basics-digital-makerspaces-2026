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