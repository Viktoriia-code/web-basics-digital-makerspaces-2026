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