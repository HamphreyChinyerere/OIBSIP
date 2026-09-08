const themeToggle = document.getElementById("themeToggle");
const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const formMessage = document.getElementById("formMessage");
const pendingList = document.getElementById("pendingList");
const pendingEmpty = document.getElementById("pendingEmpty");
const pendingCount = document.getElementById("pendingCount");
const completedList = document.getElementById("completedList");
const completedEmpty = document.getElementById("completedEmpty");
const completedCount = document.getElementById("completedCount");

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

function completeTask(taskId) {
    const task = tasks.find(
        (item) => item.id === taskId
    );

    if (!task) {
        return;
    }

    task.completed = true;

    renderTasks();
}

function restoreTask(taskId) {
    const task = tasks.find(
        (item) => item.id === taskId
    );

    if (!task) {
        return;
    }

    task.completed = false;

    renderTasks();
}

function deleteTask(taskId) {
    tasks = tasks.filter(
        (task) => task.id !== taskId
    );

    renderTasks();
}

function createDeleteButton(task) {
    const deleteButton = document.createElement("button");

    deleteButton.type = "button";
    deleteButton.className = "task-action delete-button";

    deleteButton.setAttribute(
        "aria-label",
        `Delete ${task.text}`
    );

    deleteButton.innerHTML = `
        <i data-lucide="trash-2"></i>
    `;

    deleteButton.addEventListener(
        "click",
        () => deleteTask(task.id)
    );

    return deleteButton;
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

        const taskActions = document.createElement("div");

        taskActions.className = "task-actions";

        const completeButton = document.createElement("button");

        completeButton.type = "button";
        completeButton.className = "task-action complete-button";

        completeButton.setAttribute(
            "aria-label",
            `Mark ${task.text} as complete`
        );

        completeButton.innerHTML = `
            <i data-lucide="check"></i>
        `;

        completeButton.addEventListener(
            "click",
            () => completeTask(task.id)
        );

        const deleteButton = createDeleteButton(task);

        taskActions.appendChild(completeButton);
        taskActions.appendChild(deleteButton);

        taskItem.appendChild(taskText);
        taskItem.appendChild(taskActions);

        pendingList.appendChild(taskItem);
    });

    pendingCount.textContent = pendingTasks.length;

    pendingEmpty.hidden = pendingTasks.length > 0;
}

function renderCompletedTasks() {
    const completedTasks = tasks.filter(
        (task) => task.completed
    );

    completedList.innerHTML = "";

    completedTasks.forEach((task) => {
        const taskItem = document.createElement("article");

        taskItem.className = "task-item completed-task";
        taskItem.dataset.taskId = task.id;

        const taskText = document.createElement("p");

        taskText.className = "task-text";
        taskText.textContent = task.text;

        const taskActions = document.createElement("div");

        taskActions.className = "task-actions";

        const restoreButton = document.createElement("button");

        restoreButton.type = "button";
        restoreButton.className = "task-action restore-button";

        restoreButton.setAttribute(
            "aria-label",
            `Move ${task.text} back to pending`
        );

        restoreButton.innerHTML = `
            <i data-lucide="rotate-ccw"></i>
        `;

        restoreButton.addEventListener(
            "click",
            () => restoreTask(task.id)
        );

        const deleteButton = createDeleteButton(task);

        taskActions.appendChild(restoreButton);
        taskActions.appendChild(deleteButton);

        taskItem.appendChild(taskText);
        taskItem.appendChild(taskActions);

        completedList.appendChild(taskItem);
    });

    completedCount.textContent = completedTasks.length;

    completedEmpty.hidden = completedTasks.length > 0;
}

function renderTasks() {
    renderPendingTasks();
    renderCompletedTasks();
    lucide.createIcons();
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

    renderTasks();

    taskInput.focus();
}

themeToggle.addEventListener("click", toggleTheme);

taskInput.addEventListener("input", clearFormMessage);

taskForm.addEventListener("submit", addTask);

renderTasks();