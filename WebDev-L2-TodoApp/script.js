const themeToggle = document.getElementById("themeToggle");
const taskForm = document.getElementById("taskForm");
const taskTitle = document.getElementById("taskTitle");
const taskDescription = document.getElementById("taskDescription");
const taskDeadline = document.getElementById("taskDeadline");
const descriptionCount = document.getElementById("descriptionCount");
const formMessage = document.getElementById("formMessage");

const urgentList = document.getElementById("urgentList");
const urgentEmpty = document.getElementById("urgentEmpty");
const urgentCount = document.getElementById("urgentCount");

const pendingList = document.getElementById("pendingList");
const pendingEmpty = document.getElementById("pendingEmpty");
const pendingCount = document.getElementById("pendingCount");

const completedList = document.getElementById("completedList");
const completedEmpty = document.getElementById("completedEmpty");
const completedCount = document.getElementById("completedCount");

const totalCount = document.getElementById("totalCount");
const summaryUrgentCount = document.getElementById("summaryUrgentCount");
const summaryPendingCount = document.getElementById("summaryPendingCount");
const summaryCompletedCount = document.getElementById("summaryCompletedCount");

const clearCompletedButton = document.getElementById("clearCompletedButton");

const quoteText = document.getElementById("quoteText");
const quoteAuthor = document.getElementById("quoteAuthor");

const TASKS_STORAGE_KEY = "taskflow-tasks";
const THEME_STORAGE_KEY = "taskflow-theme";

const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;

let tasks = [];
let currentTheme = "light";
let editingTaskId = null;
let messageTimer = null;

const quotes = [
    {
        text: "Focus on being productive instead of busy.",
        author: "Tim Ferriss"
    },
    {
        text: "Efficiency is doing things right; effectiveness is doing the right things.",
        author: "Peter Drucker"
    },
    {
        text: "Well done is better than well said.",
        author: "Benjamin Franklin"
    },
    {
        text: "Lost time is never found again.",
        author: "Benjamin Franklin"
    },
    {
        text: "Genius is one percent inspiration and ninety-nine percent perspiration.",
        author: "Thomas Edison"
    },
    {
        text: "The only way to do great work is to love what you do.",
        author: "Steve Jobs"
    },
    {
        text: "The way to get started is to quit talking and begin doing.",
        author: "Walt Disney"
    },
    {
        text: "Nothing will work unless you do.",
        author: "Maya Angelou"
    },
    {
        text: "The most effective way to do it, is to do it.",
        author: "Amelia Earhart"
    },
    {
        text: "Don't count the days; make the days count.",
        author: "Muhammad Ali"
    },
    {
        text: "Either you run the day or the day runs you.",
        author: "Jim Rohn"
    },
    {
        text: "You don't have to be great to start, but you have to start to be great.",
        author: "Zig Ziglar"
    },
    {
        text: "If you spend too much time thinking about a thing, you'll never get it done.",
        author: "Bruce Lee"
    },
    {
        text: "The key is not to prioritize what's on your schedule, but to schedule your priorities.",
        author: "Stephen Covey"
    },
    {
        text: "Make each day your masterpiece.",
        author: "John Wooden"
    },
    {
        text: "It is not enough to be busy. The question is: What are we busy about?",
        author: "Henry David Thoreau"
    },
    {
        text: "Action is the foundational key to all success.",
        author: "Pablo Picasso"
    },
    {
        text: "Never put off till tomorrow what you can do today.",
        author: "Thomas Jefferson"
    },
    {
        text: "The secret of getting ahead is getting started.",
        author: "Mark Twain"
    },
    {
        text: "The only place success comes before work is in the dictionary.",
        author: "Vince Lombardi"
    },
    {
        text: "A goal is a dream with a deadline.",
        author: "Napoleon Hill"
    },
    {
        text: "Every minute you spend in planning saves time in execution.",
        author: "Brian Tracy"
    },
    {
        text: "You can do anything, but not everything.",
        author: "David Allen"
    },
    {
        text: "You will never change your life until you change something you do daily.",
        author: "John C. Maxwell"
    },
    {
        text: "Setting goals is the first step in turning the invisible into the visible.",
        author: "Tony Robbins"
    },
    {
        text: "Doing the best at this moment puts you in the best place for the next moment.",
        author: "Oprah Winfrey"
    },
    {
        text: "Some people want it to happen, some wish it would happen, others make it happen.",
        author: "Michael Jordan"
    },
    {
        text: "You miss 100% of the shots you don't take.",
        author: "Wayne Gretzky"
    },
    {
        text: "Believe you can and you're halfway there.",
        author: "Theodore Roosevelt"
    },
    {
        text: "It takes as much energy to wish as it does to plan.",
        author: "Eleanor Roosevelt"
    },
    {
        text: "A journey of a thousand miles begins with a single step.",
        author: "Lao Tzu"
    },
    {
        text: "I will prepare and someday my chance will come.",
        author: "Abraham Lincoln"
    },
    {
        text: "Alone we can do so little; together we can do so much.",
        author: "Helen Keller"
    },
    {
        text: "How wonderful it is that nobody need wait a single moment before starting to improve the world.",
        author: "Anne Frank"
    },
    {
        text: "Success is most often achieved by those who don't know that failure is inevitable.",
        author: "Coco Chanel"
    },
    {
        text: "Great things come from hard work and perseverance. No excuses.",
        author: "Kobe Bryant"
    },
    {
        text: "A champion is defined by how they recover when they fall.",
        author: "Serena Williams"
    },
    {
        text: "Success isn't always about greatness. It's about consistency.",
        author: "Dwayne Johnson"
    },
    {
        text: "Do the hard jobs first. The easy jobs will take care of themselves.",
        author: "Dale Carnegie"
    },
    {
        text: "A good plan today is better than a perfect plan tomorrow.",
        author: "George S. Patton"
    },
    {
        text: "Expect the best, plan for the worst, and prepare to be surprised.",
        author: "Denis Waitley"
    },
    {
        text: "A year from now you may wish you had started today.",
        author: "Karen Lamb"
    },
    {
        text: "You will never find time for anything. If you want time, you must make it.",
        author: "Charles Buxton"
    },
    {
        text: "Don't say you don't have enough time. You have exactly the same hours each day.",
        author: "H. Jackson Brown Jr."
    },
    {
        text: "Success is to be measured by the obstacles which you have overcome.",
        author: "Booker T. Washington"
    },
    {
        text: "It is never too late to be what you might have been.",
        author: "George Eliot"
    },
    {
        text: "Knowing is not enough; we must apply. Willing is not enough; we must do.",
        author: "Johann Wolfgang von Goethe"
    },
    {
        text: "The question isn't who is going to let me; it's who is going to stop me.",
        author: "Ayn Rand"
    },
    {
        text: "Life is like riding a bicycle. To keep your balance, you must keep moving.",
        author: "Albert Einstein"
    },
    {
        text: "It does not matter how slowly you go as long as you do not stop.",
        author: "Confucius"
    }
];

function displayRandomQuote() {
    const randomIndex = Math.floor(
        Math.random() * quotes.length
    );

    const quote = quotes[randomIndex];

    quoteText.textContent = `“${quote.text}”`;
    quoteAuthor.textContent = `— ${quote.author}`;
}

function saveTasks() {
    localStorage.setItem(
        TASKS_STORAGE_KEY,
        JSON.stringify(tasks)
    );
}

function loadTasks() {
    const storedTasks = localStorage.getItem(
        TASKS_STORAGE_KEY
    );

    if (!storedTasks) {
        tasks = [];
        return;
    }

    try {
        const parsedTasks = JSON.parse(storedTasks);

        tasks = Array.isArray(parsedTasks)
            ? parsedTasks
            : [];
    } catch {
        tasks = [];
    }
}

function loadTheme() {
    const savedTheme = localStorage.getItem(
        THEME_STORAGE_KEY
    );

    if (
        savedTheme === "light" ||
        savedTheme === "dark"
    ) {
        currentTheme = savedTheme;
    } else if (
        window.matchMedia &&
        window.matchMedia(
            "(prefers-color-scheme: dark)"
        ).matches
    ) {
        currentTheme = "dark";
    }

    applyTheme();
}

function applyTheme() {
    document.documentElement.setAttribute(
        "data-theme",
        currentTheme
    );

    const icon =
        currentTheme === "dark"
            ? "sun"
            : "moon";

    themeToggle.innerHTML =
        `<i data-lucide="${icon}"></i>`;

    themeToggle.setAttribute(
        "aria-label",
        currentTheme === "dark"
            ? "Switch to light mode"
            : "Switch to dark mode"
    );

    lucide.createIcons();
}

function toggleTheme() {
    currentTheme =
        currentTheme === "light"
            ? "dark"
            : "light";

    localStorage.setItem(
        THEME_STORAGE_KEY,
        currentTheme
    );

    applyTheme();
}

function getMinimumDeadline() {
    const now = new Date();

    now.setMinutes(
        now.getMinutes() - now.getTimezoneOffset()
    );

    return now
        .toISOString()
        .slice(0, 16);
}

function updateDeadlineMinimum() {
    taskDeadline.min = getMinimumDeadline();
}

function updateDescriptionCount() {
    descriptionCount.textContent =
        `${taskDescription.value.length} / 300`;
}

function showFormMessage(
    message,
    type = "success"
) {
    clearTimeout(messageTimer);

    formMessage.textContent = message;

    formMessage.classList.toggle(
        "error",
        type === "error"
    );

    messageTimer = setTimeout(() => {
        formMessage.textContent = "";
        formMessage.classList.remove("error");
    }, 3500);
}

function createTask(
    title,
    description,
    deadline
) {
    const now = new Date();

    return {
        id:
            Date.now() +
            Math.floor(Math.random() * 1000),
        title,
        description,
        createdAt: now.toISOString(),
        deadline: new Date(deadline).toISOString(),
        completed: false,
        completedAt: null
    };
}

function purgeExpiredTasks() {
    const now = Date.now();

    const activeTasks = tasks.filter(
        (task) => {
            const deadline =
                new Date(task.deadline).getTime();

            return (
                Number.isFinite(deadline) &&
                deadline > now
            );
        }
    );

    if (activeTasks.length !== tasks.length) {
        tasks = activeTasks;

        if (
            editingTaskId &&
            !tasks.some(
                (task) =>
                    task.id === editingTaskId
            )
        ) {
            editingTaskId = null;
        }

        saveTasks();

        return true;
    }

    return false;
}

function getRemainingTime(task) {
    return (
        new Date(task.deadline).getTime() -
        Date.now()
    );
}

function getOriginalDuration(task) {
    return (
        new Date(task.deadline).getTime() -
        new Date(task.createdAt).getTime()
    );
}

function isUrgent(task) {
    if (task.completed) {
        return false;
    }

    const remaining =
        getRemainingTime(task);

    const originalDuration =
        getOriginalDuration(task);

    if (remaining <= 0) {
        return false;
    }

    if (originalDuration > DAY) {
        return remaining <= DAY;
    }

    return remaining <= 3 * HOUR;
}

function formatDateTime(value) {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "";
    }

    return date.toLocaleString([], {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
}

function formatRemainingTime(task) {
    const remaining =
        getRemainingTime(task);

    if (remaining <= 0) {
        return "Expired";
    }

    const days =
        Math.floor(remaining / DAY);

    const hours =
        Math.floor(
            (remaining % DAY) / HOUR
        );

    const minutes =
        Math.floor(
            (remaining % HOUR) /
            (60 * 1000)
        );

    if (days > 0) {
        return `${days}d ${hours}h remaining`;
    }

    if (hours > 0) {
        return `${hours}h ${minutes}m remaining`;
    }

    return `${Math.max(minutes, 1)}m remaining`;
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

function clearCompletedTasks() {
    tasks = tasks.filter(
        (task) => !task.completed
    );

    editingTaskId = null;

    saveTasks();
    renderTasks();

    showFormMessage(
        "Completed tasks cleared."
    );
}

function startEditingTask(taskId) {
    editingTaskId = taskId;

    renderTasks();
}

function cancelEditingTask() {
    editingTaskId = null;

    renderTasks();
}

function toDateTimeLocal(value) {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "";
    }

    const localDate = new Date(
        date.getTime() -
        date.getTimezoneOffset() *
        60000
    );

    return localDate
        .toISOString()
        .slice(0, 16);
}

function createActionButton(
    icon,
    label,
    className,
    callback
) {
    const button =
        document.createElement("button");

    button.type = "button";

    button.className =
        `task-action ${className}`;

    button.setAttribute(
        "aria-label",
        label
    );

    button.title = label;

    button.innerHTML =
        `<i data-lucide="${icon}"></i>`;

    button.addEventListener(
        "click",
        callback
    );

    return button;
}

function createTaskContent(
    task,
    urgent
) {
    const main =
        document.createElement("div");

    main.className = "task-main";

    const topline =
        document.createElement("div");

    topline.className = "task-topline";

    const title =
        document.createElement("h3");

    title.className = "task-title";
    title.textContent = task.title;

    topline.appendChild(title);

    if (urgent) {
        const badge =
            document.createElement("span");

        badge.className =
            "urgent-badge";

        badge.innerHTML = `
            <i data-lucide="clock-3"></i>
            Urgent
        `;

        topline.appendChild(badge);
    }

    const description =
        document.createElement("p");

    description.className =
        "task-description";

    description.textContent =
        task.description;

    const metaRow =
        document.createElement("div");

    metaRow.className =
        "task-meta-row";

    const deadlineMeta =
        document.createElement("span");

    deadlineMeta.className =
        "task-meta";

    if (urgent) {
        deadlineMeta.classList.add(
            "deadline-warning"
        );
    }

    deadlineMeta.innerHTML = `
        <i data-lucide="calendar-clock"></i>
        ${formatDateTime(task.deadline)}
    `;

    const remainingMeta =
        document.createElement("span");

    remainingMeta.className =
        "task-meta";

    if (urgent) {
        remainingMeta.classList.add(
            "deadline-warning"
        );
    }

    if (task.completed) {
        remainingMeta.innerHTML = `
            <i data-lucide="circle-check"></i>
            Completed ${formatDateTime(task.completedAt)}
        `;
    } else {
        remainingMeta.innerHTML = `
            <i data-lucide="timer"></i>
            ${formatRemainingTime(task)}
        `;
    }

    metaRow.appendChild(deadlineMeta);
    metaRow.appendChild(remainingMeta);

    main.appendChild(topline);
    main.appendChild(description);
    main.appendChild(metaRow);

    return main;
}

function saveEditedTask(
    task,
    titleInput,
    descriptionInput,
    deadlineInput,
    errorElement
) {
    const title =
        titleInput.value.trim();

    const description =
        descriptionInput.value.trim();

    const deadlineValue =
        deadlineInput.value;

    if (!title) {
        errorElement.textContent =
            "Task title is required.";

        titleInput.focus();

        return;
    }

    if (!description) {
        errorElement.textContent =
            "Description is required.";

        descriptionInput.focus();

        return;
    }

    if (!deadlineValue) {
        errorElement.textContent =
            "Select a deadline.";

        deadlineInput.focus();

        return;
    }

    const deadline =
        new Date(deadlineValue);

    if (
        Number.isNaN(deadline.getTime()) ||
        deadline.getTime() <= Date.now()
    ) {
        errorElement.textContent =
            "Deadline must be in the future.";

        deadlineInput.focus();

        return;
    }

    task.title = title;
    task.description = description;
    task.deadline =
        deadline.toISOString();

    editingTaskId = null;

    saveTasks();
    renderTasks();
}

function createEditForm(task) {
    const wrapper =
        document.createElement("div");

    wrapper.className =
        "task-edit";

    const grid =
        document.createElement("div");

    grid.className =
        "edit-grid";

    const titleGroup =
        document.createElement("div");

    const titleLabel =
        document.createElement("label");

    titleLabel.className =
        "edit-label";

    titleLabel.textContent =
        "Task title";

    const titleInput =
        document.createElement("input");

    titleInput.className =
        "edit-input";

    titleInput.type = "text";
    titleInput.maxLength = 80;
    titleInput.value = task.title;

    titleGroup.appendChild(titleLabel);
    titleGroup.appendChild(titleInput);

    const descriptionGroup =
        document.createElement("div");

    const descriptionLabel =
        document.createElement("label");

    descriptionLabel.className =
        "edit-label";

    descriptionLabel.textContent =
        "Description";

    const descriptionInput =
        document.createElement("textarea");

    descriptionInput.className =
        "edit-textarea";

    descriptionInput.maxLength = 300;
    descriptionInput.value =
        task.description;

    descriptionGroup.appendChild(
        descriptionLabel
    );

    descriptionGroup.appendChild(
        descriptionInput
    );

    const deadlineGroup =
        document.createElement("div");

    const deadlineLabel =
        document.createElement("label");

    deadlineLabel.className =
        "edit-label";

    deadlineLabel.textContent =
        "Deadline";

    const deadlineInput =
        document.createElement("input");

    deadlineInput.className =
        "edit-input";

    deadlineInput.type =
        "datetime-local";

    deadlineInput.min =
        getMinimumDeadline();

    deadlineInput.value =
        toDateTimeLocal(task.deadline);

    deadlineGroup.appendChild(
        deadlineLabel
    );

    deadlineGroup.appendChild(
        deadlineInput
    );

    const errorElement =
        document.createElement("p");

    errorElement.className =
        "edit-error";

    errorElement.setAttribute(
        "aria-live",
        "polite"
    );

    const actions =
        document.createElement("div");

    actions.className =
        "edit-actions";

    const saveButton =
        createActionButton(
            "check",
            "Save changes",
            "save-edit-button",
            () =>
                saveEditedTask(
                    task,
                    titleInput,
                    descriptionInput,
                    deadlineInput,
                    errorElement
                )
        );

    const cancelButton =
        createActionButton(
            "x",
            "Cancel editing",
            "cancel-edit-button",
            cancelEditingTask
        );

    actions.appendChild(saveButton);
    actions.appendChild(cancelButton);

    grid.appendChild(titleGroup);
    grid.appendChild(descriptionGroup);
    grid.appendChild(deadlineGroup);
    grid.appendChild(errorElement);

    wrapper.appendChild(grid);
    wrapper.appendChild(actions);

    setTimeout(() => {
        titleInput.focus();
        titleInput.select();
    }, 0);

    return wrapper;
}

function createTaskCard(
    task,
    urgent = false
) {
    const card =
        document.createElement("article");

    card.className = "task-card";

    if (urgent) {
        card.classList.add(
            "urgent-task"
        );
    }

    if (task.completed) {
        card.classList.add(
            "completed-task"
        );
    }

    card.dataset.taskId =
        task.id;

    if (editingTaskId === task.id) {
        card.appendChild(
            createEditForm(task)
        );

        return card;
    }

    card.appendChild(
        createTaskContent(
            task,
            urgent
        )
    );

    const actions =
        document.createElement("div");

    actions.className =
        "task-actions";

    if (task.completed) {
        actions.appendChild(
            createActionButton(
                "rotate-ccw",
                "Move back to pending",
                "restore-button",
                () =>
                    restoreTask(task.id)
            )
        );
    } else {
        actions.appendChild(
            createActionButton(
                "check",
                "Mark complete",
                "complete-button",
                () =>
                    completeTask(task.id)
            )
        );
    }

    actions.appendChild(
        createActionButton(
            "pencil",
            "Edit task",
            "edit-button",
            () =>
                startEditingTask(task.id)
        )
    );

    actions.appendChild(
        createActionButton(
            "trash-2",
            "Delete task",
            "delete-button",
            () =>
                deleteTask(task.id)
        )
    );

    card.appendChild(actions);

    return card;
}

function renderUrgentTasks() {
    const urgentTasks =
        tasks
            .filter(
                (task) =>
                    !task.completed &&
                    isUrgent(task)
            )
            .sort(
                (a, b) =>
                    new Date(a.deadline) -
                    new Date(b.deadline)
            );

    urgentList.innerHTML = "";

    urgentTasks.forEach(
        (task) => {
            urgentList.appendChild(
                createTaskCard(
                    task,
                    true
                )
            );
        }
    );

    urgentCount.textContent =
        urgentTasks.length;

    urgentEmpty.hidden =
        urgentTasks.length > 0;
}

function renderPendingTasks() {
    const pendingTasks =
        tasks
            .filter(
                (task) =>
                    !task.completed &&
                    !isUrgent(task)
            )
            .sort(
                (a, b) =>
                    new Date(a.deadline) -
                    new Date(b.deadline)
            );

    pendingList.innerHTML = "";

    pendingTasks.forEach(
        (task) => {
            pendingList.appendChild(
                createTaskCard(task)
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
        tasks
            .filter(
                (task) =>
                    task.completed
            )
            .sort(
                (a, b) =>
                    new Date(
                        b.completedAt
                    ) -
                    new Date(
                        a.completedAt
                    )
            );

    completedList.innerHTML = "";

    completedTasks.forEach(
        (task) => {
            completedList.appendChild(
                createTaskCard(task)
            );
        }
    );

    completedCount.textContent =
        completedTasks.length;

    completedEmpty.hidden =
        completedTasks.length > 0;

    clearCompletedButton.disabled =
        completedTasks.length === 0;
}

function updateSummary() {
    const urgentTasks =
        tasks.filter(
            (task) =>
                !task.completed &&
                isUrgent(task)
        );

    const pendingTasks =
        tasks.filter(
            (task) =>
                !task.completed &&
                !isUrgent(task)
        );

    const completedTasks =
        tasks.filter(
            (task) =>
                task.completed
        );

    totalCount.textContent =
        tasks.length;

    summaryUrgentCount.textContent =
        urgentTasks.length;

    summaryPendingCount.textContent =
        pendingTasks.length;

    summaryCompletedCount.textContent =
        completedTasks.length;
}

function renderTasks() {
    purgeExpiredTasks();

    renderUrgentTasks();
    renderPendingTasks();
    renderCompletedTasks();
    updateSummary();

    lucide.createIcons();
}

function handleTaskSubmit(event) {
    event.preventDefault();

    const title =
        taskTitle.value.trim();

    const description =
        taskDescription.value.trim();

    const deadlineValue =
        taskDeadline.value;

    if (!title) {
        showFormMessage(
            "Enter a task title.",
            "error"
        );

        taskTitle.focus();

        return;
    }

    if (!description) {
        showFormMessage(
            "Enter a task description.",
            "error"
        );

        taskDescription.focus();

        return;
    }

    if (!deadlineValue) {
        showFormMessage(
            "Select a deadline.",
            "error"
        );

        taskDeadline.focus();

        return;
    }

    const deadline =
        new Date(deadlineValue);

    if (
        Number.isNaN(deadline.getTime()) ||
        deadline.getTime() <= Date.now()
    ) {
        showFormMessage(
            "Deadline must be in the future.",
            "error"
        );

        taskDeadline.focus();

        return;
    }

    tasks.push(
        createTask(
            title,
            description,
            deadlineValue
        )
    );

    saveTasks();

    taskForm.reset();

    updateDescriptionCount();
    updateDeadlineMinimum();

    showFormMessage(
        "Task added successfully."
    );

    renderTasks();

    taskTitle.focus();
}

themeToggle.addEventListener(
    "click",
    toggleTheme
);

taskDescription.addEventListener(
    "input",
    updateDescriptionCount
);

taskForm.addEventListener(
    "submit",
    handleTaskSubmit
);

clearCompletedButton.addEventListener(
    "click",
    clearCompletedTasks
);

displayRandomQuote();
loadTheme();
loadTasks();
updateDescriptionCount();
updateDeadlineMinimum();
renderTasks();

setInterval(
    () => {
        updateDeadlineMinimum();

        const expired =
            purgeExpiredTasks();

        renderTasks();

        if (expired) {
            saveTasks();
        }
    },
    30000
);