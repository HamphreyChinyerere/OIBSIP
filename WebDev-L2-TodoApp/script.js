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

const TASKS_STORAGE_KEY = "taskflow-tasks";

let currentTheme = "light";
let tasks = [];
let editingTaskId = null;

function saveTasks() {
    localStorage.setItem(
        TASKS_STORAGE_KEY,
        JSON.stringify(tasks)
    );
}

function loadTasks() {
    const savedTasks = localStorage.getItem(
        TASKS_STORAGE_KEY
    );

    if (!savedTasks) {
        tasks = [];
        return;
    }

    try {
        const parsedTasks = JSON.parse(savedTasks);

        tasks = Array.isArray(parsedTasks)
            ? parsedTasks
            : [];
    } catch {
        tasks = [];
    }
}

function updateThemeIcon() {
    const iconName =
        currentTheme === "dark"
            ? "sun"
            : "moon";

    themeToggle.innerHTML =
        `<i data-lucide="${iconName}"></i>`;

    lucide.createIcons();
}

function toggleTheme() {
    currentTheme =
        currentTheme === "light"
            ? "dark"
            : "light";

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
        createdAt: new Date().toISOString(),
        completedAt: null
    };
}

function formatTimestamp(timestamp) {
    if (!timestamp) {
        return "";
    }

    const date = new Date(timestamp);

    return date.toLocaleString([], {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
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
    task.completedAt =
        new Date().toISOString();

    editingTaskId = null;

    saveTasks();
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
    task.completedAt = null;

    editingTaskId = null;

    saveTasks();
    renderTasks();
}

function deleteTask(taskId) {
    tasks = tasks.filter(
        (task) => task.id !== taskId
    );

    if (editingTaskId === taskId) {
        editingTaskId = null;
    }

    saveTasks();
    renderTasks();
}

function startEditingTask(taskId) {
    editingTaskId = taskId;

    renderTasks();
}

function cancelEditingTask() {
    editingTaskId = null;

    renderTasks();
}

function saveEditedTask(
    taskId,
    editInput,
    editError
) {
    const updatedText =
        editInput.value.trim();

    if (!updatedText) {
        editError.textContent =
            "Task cannot be empty.";

        editInput.focus();

        return;
    }

    const task = tasks.find(
        (item) => item.id === taskId
    );

    if (!task) {
        return;
    }

    task.text = updatedText;

    editingTaskId = null;

    saveTasks();
    renderTasks();
}

function createTaskContent(task) {
    const taskContent =
        document.createElement("div");

    const taskText =
        document.createElement("p");

    const taskMeta =
        document.createElement("p");

    taskContent.className =
        "task-content";

    taskText.className =
        "task-text";

    taskMeta.className =
        "task-meta";

    taskText.textContent =
        task.text;

    if (
        task.completed &&
        task.completedAt
    ) {
        taskMeta.textContent =
            `Completed ${formatTimestamp(task.completedAt)}`;
    } else {
        taskMeta.textContent =
            `Created ${formatTimestamp(task.createdAt)}`;
    }

    taskContent.appendChild(taskText);
    taskContent.appendChild(taskMeta);

    return taskContent;
}

function createDeleteButton(task) {
    const deleteButton =
        document.createElement("button");

    deleteButton.type =
        "button";

    deleteButton.className =
        "task-action delete-button";

    deleteButton.setAttribute(
        "aria-label",
        `Delete ${task.text}`
    );

    deleteButton.innerHTML =
        `<i data-lucide="trash-2"></i>`;

    deleteButton.addEventListener(
        "click",
        () => deleteTask(task.id)
    );

    return deleteButton;
}

function createEditButton(task) {
    const editButton =
        document.createElement("button");

    editButton.type =
        "button";

    editButton.className =
        "task-action edit-button";

    editButton.setAttribute(
        "aria-label",
        `Edit ${task.text}`
    );

    editButton.innerHTML =
        `<i data-lucide="pencil"></i>`;

    editButton.addEventListener(
        "click",
        () => startEditingTask(task.id)
    );

    return editButton;
}

function createEditContent(task) {
    const editWrapper =
        document.createElement("div");

    const editField =
        document.createElement("div");

    const editInput =
        document.createElement("input");

    const editError =
        document.createElement("p");

    const editActions =
        document.createElement("div");

    const saveButton =
        document.createElement("button");

    const cancelButton =
        document.createElement("button");

    editWrapper.className =
        "task-edit";

    editField.className =
        "edit-field";

    editInput.type =
        "text";

    editInput.className =
        "edit-input";

    editInput.value =
        task.text;

    editInput.maxLength =
        120;

    editInput.setAttribute(
        "aria-label",
        `Edit ${task.text}`
    );

    editError.className =
        "edit-error";

    editError.setAttribute(
        "aria-live",
        "polite"
    );

    saveButton.type =
        "button";

    saveButton.className =
        "task-action save-edit-button";

    saveButton.setAttribute(
        "aria-label",
        "Save task"
    );

    saveButton.innerHTML =
        `<i data-lucide="check"></i>`;

    cancelButton.type =
        "button";

    cancelButton.className =
        "task-action cancel-edit-button";

    cancelButton.setAttribute(
        "aria-label",
        "Cancel editing"
    );

    cancelButton.innerHTML =
        `<i data-lucide="x"></i>`;

    saveButton.addEventListener(
        "click",
        () => saveEditedTask(
            task.id,
            editInput,
            editError
        )
    );

    cancelButton.addEventListener(
        "click",
        cancelEditingTask
    );

    editInput.addEventListener(
        "input",
        () => {
            editError.textContent = "";
        }
    );

    editInput.addEventListener(
        "keydown",
        (event) => {
            if (event.key === "Enter") {
                event.preventDefault();

                saveEditedTask(
                    task.id,
                    editInput,
                    editError
                );
            }

            if (event.key === "Escape") {
                event.preventDefault();

                cancelEditingTask();
            }
        }
    );

    editActions.className =
        "edit-actions";

    editField.appendChild(editInput);
    editField.appendChild(editError);

    editActions.appendChild(saveButton);
    editActions.appendChild(cancelButton);

    editWrapper.appendChild(editField);
    editWrapper.appendChild(editActions);

    setTimeout(() => {
        editInput.focus();
        editInput.select();
    }, 0);

    return editWrapper;
}

function renderPendingTasks() {
    const pendingTasks =
        tasks.filter(
            (task) => !task.completed
        );

    pendingList.innerHTML = "";

    pendingTasks.forEach(
        (task) => {
            const taskItem =
                document.createElement(
                    "article"
                );

            taskItem.className =
                "task-item";

            taskItem.dataset.taskId =
                task.id;

            if (
                editingTaskId === task.id
            ) {
                taskItem.appendChild(
                    createEditContent(task)
                );

                pendingList.appendChild(
                    taskItem
                );

                return;
            }

            const taskContent =
                createTaskContent(task);

            const taskActions =
                document.createElement(
                    "div"
                );

            const completeButton =
                document.createElement(
                    "button"
                );

            taskActions.className =
                "task-actions";

            completeButton.type =
                "button";

            completeButton.className =
                "task-action complete-button";

            completeButton.setAttribute(
                "aria-label",
                `Mark ${task.text} as complete`
            );

            completeButton.innerHTML =
                `<i data-lucide="check"></i>`;

            completeButton.addEventListener(
                "click",
                () => completeTask(task.id)
            );

            const editButton =
                createEditButton(task);

            const deleteButton =
                createDeleteButton(task);

            taskActions.appendChild(
                completeButton
            );

            taskActions.appendChild(
                editButton
            );

            taskActions.appendChild(
                deleteButton
            );

            taskItem.appendChild(
                taskContent
            );

            taskItem.appendChild(
                taskActions
            );

            pendingList.appendChild(
                taskItem
            );
        }
    );

    pendingCount.textContent =
        pendingTasks.length;

    pendingEmpty.hidden =
        pendingTasks.length > 0;
}

function renderCompletedTasks() {
    const completedTasks =
        tasks.filter(
            (task) => task.completed
        );

    completedList.innerHTML = "";

    completedTasks.forEach(
        (task) => {
            const taskItem =
                document.createElement(
                    "article"
                );

            taskItem.className =
                "task-item completed-task";

            taskItem.dataset.taskId =
                task.id;

            if (
                editingTaskId === task.id
            ) {
                taskItem.appendChild(
                    createEditContent(task)
                );

                completedList.appendChild(
                    taskItem
                );

                return;
            }

            const taskContent =
                createTaskContent(task);

            const taskActions =
                document.createElement(
                    "div"
                );

            const restoreButton =
                document.createElement(
                    "button"
                );

            taskActions.className =
                "task-actions";

            restoreButton.type =
                "button";

            restoreButton.className =
                "task-action restore-button";

            restoreButton.setAttribute(
                "aria-label",
                `Move ${task.text} back to pending`
            );

            restoreButton.innerHTML =
                `<i data-lucide="rotate-ccw"></i>`;

            restoreButton.addEventListener(
                "click",
                () => restoreTask(task.id)
            );

            const editButton =
                createEditButton(task);

            const deleteButton =
                createDeleteButton(task);

            taskActions.appendChild(
                restoreButton
            );

            taskActions.appendChild(
                editButton
            );

            taskActions.appendChild(
                deleteButton
            );

            taskItem.appendChild(
                taskContent
            );

            taskItem.appendChild(
                taskActions
            );

            completedList.appendChild(
                taskItem
            );
        }
    );

    completedCount.textContent =
        completedTasks.length;

    completedEmpty.hidden =
        completedTasks.length > 0;
}

function renderTasks() {
    renderPendingTasks();
    renderCompletedTasks();

    lucide.createIcons();
}

function addTask(event) {
    event.preventDefault();

    const taskText =
        taskInput.value.trim();

    if (!taskText) {
        showFormMessage(
            "Enter a task before adding it."
        );

        taskInput.focus();

        return;
    }

    const newTask =
        createTask(taskText);

    tasks.push(newTask);

    taskInput.value = "";

    showFormMessage(
        "Task added successfully."
    );

    saveTasks();
    renderTasks();

    taskInput.focus();
}

themeToggle.addEventListener(
    "click",
    toggleTheme
);

taskInput.addEventListener(
    "input",
    clearFormMessage
);

taskForm.addEventListener(
    "submit",
    addTask
);

loadTasks();
renderTasks();