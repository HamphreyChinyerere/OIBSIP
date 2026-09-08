const themeToggle = document.getElementById("themeToggle");
const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const formMessage = document.getElementById("formMessage");
const pendingList = document.getElementById("pendingList");
const pendingEmpty = document.getElementById("pendingEmpty");
const pendingCount = document.getElementById("pendingCount");

let currentTheme = "light";
let tasks = [];

function updateThemeIcon() {
    const iconName = currentTheme === "dark" ? "sun" : "moon";

    themeToggle.innerHTML = `<i data-lucide="${iconName}"></i>`;

    lucide.createIcons();
}

function toggleTheme() {
    currentTheme = currentTheme === "light" ? "dark" : "light";

    document.documentElement.setAttribute(
        "data-theme",
        currentTheme
    );

    themeToggle.setAttribute(
        "aria-label",
        currentTheme === "dark"
            ? "Switch to light mode"
            : "Switch to dark mode"
    );

    updateThemeIcon();
}

function createTask(taskText) {
    return {
        id: Date.now(),
        text: taskText,
        completed: false,
        createdAt: new Date().toISOString()
    };
}

function showFormMessage(message) {
    formMessage.textContent = message;
}

function clearFormMessage() {
    formMessage.textContent = "";
}

function renderPendingTasks() {
    const pendingTasks = tasks.filter(
        (task) => !task.completed
    );

    pendingList.innerHTML = "";

    pendingTasks.forEach((task) => {
        const taskItem = document.createElement("article");

        taskItem.className = "task-item";
        taskItem.dataset.taskId = task.id;

        const taskText = document.createElement("p");

        taskText.className = "task-text";
        taskText.textContent = task.text;

        taskItem.appendChild(taskText);

        pendingList.appendChild(taskItem);
    });

    pendingCount.textContent = pendingTasks.length;

    pendingEmpty.hidden = pendingTasks.length > 0;
}

function addTask(event) {
    event.preventDefault();

    const taskText = taskInput.value.trim();

    if (!taskText) {
        showFormMessage("Enter a task before adding it.");
        taskInput.focus();
        return;
    }

    const newTask = createTask(taskText);

    tasks.push(newTask);

    taskInput.value = "";

    showFormMessage("Task added successfully.");

    renderPendingTasks();

    taskInput.focus();
}

themeToggle.addEventListener("click", toggleTheme);

taskInput.addEventListener("input", clearFormMessage);

taskForm.addEventListener("submit", addTask);

renderPendingTasks();