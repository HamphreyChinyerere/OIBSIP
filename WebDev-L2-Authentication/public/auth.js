const loginTab = document.getElementById("loginTab");
const registerTab = document.getElementById("registerTab");
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const formTitle = document.getElementById("formTitle");
const formDescription = document.getElementById("formDescription");
const switchPrompt = document.getElementById("switchPrompt");
const switchAuthButton = document.getElementById("switchAuthButton");
const themeToggle = document.getElementById("themeToggle");
const registerPassword = document.getElementById("registerPassword");
const confirmPassword = document.getElementById("confirmPassword");
const lengthRequirement = document.getElementById("lengthRequirement");
const numberRequirement = document.getElementById("numberRequirement");
const loginMessage = document.getElementById("loginMessage");
const registerMessage = document.getElementById("registerMessage");

const THEME_STORAGE_KEY = "authflow-theme";

let currentView = "login";
let currentTheme = "light";

function updateIcons() {
    lucide.createIcons();
}

function clearMessages() {
    loginMessage.textContent = "";
    loginMessage.className = "form-message";

    registerMessage.textContent = "";
    registerMessage.className = "form-message";
}

function showLogin() {
    currentView = "login";

    loginForm.hidden = false;
    registerForm.hidden = true;

    loginTab.classList.add("active");
    registerTab.classList.remove("active");

    loginTab.setAttribute(
        "aria-selected",
        "true"
    );

    registerTab.setAttribute(
        "aria-selected",
        "false"
    );

    formTitle.textContent = "Welcome back";

    formDescription.textContent =
        "Enter your credentials to continue.";

    switchPrompt.textContent =
        "Don't have an account?";

    switchAuthButton.textContent =
        "Register";

    clearMessages();
}

function showRegister() {
    currentView = "register";

    loginForm.hidden = true;
    registerForm.hidden = false;

    loginTab.classList.remove("active");
    registerTab.classList.add("active");

    loginTab.setAttribute(
        "aria-selected",
        "false"
    );

    registerTab.setAttribute(
        "aria-selected",
        "true"
    );

    formTitle.textContent =
        "Create your account";

    formDescription.textContent =
        "Register securely to access your protected dashboard.";

    switchPrompt.textContent =
        "Already have an account?";

    switchAuthButton.textContent =
        "Login";

    clearMessages();

    document
        .getElementById("registerUsername")
        .focus();
}

function switchAuthView() {
    if (currentView === "login") {
        showRegister();
    } else {
        showLogin();
    }
}

function updateThemeIcon() {
    const iconName =
        currentTheme === "dark"
            ? "sun"
            : "moon";

    themeToggle.innerHTML =
        `<i data-lucide="${iconName}"></i>`;

    themeToggle.setAttribute(
        "aria-label",
        currentTheme === "dark"
            ? "Switch to light mode"
            : "Switch to dark mode"
    );

    updateIcons();
}

function applyTheme() {
    document.documentElement.setAttribute(
        "data-theme",
        currentTheme
    );

    updateThemeIcon();
}

function loadTheme() {
    const savedTheme =
        localStorage.getItem(
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

function togglePasswordVisibility(button) {
    const inputId =
        button.dataset.passwordTarget;

    const input =
        document.getElementById(inputId);

    if (!input) {
        return;
    }

    const isHidden =
        input.type === "password";

    input.type =
        isHidden
            ? "text"
            : "password";

    button.innerHTML =
        isHidden
            ? '<i data-lucide="eye-off"></i>'
            : '<i data-lucide="eye"></i>';

    button.setAttribute(
        "aria-label",
        isHidden
            ? "Hide password"
            : "Show password"
    );

    updateIcons();
}

function updatePasswordRequirements() {
    const password =
        registerPassword.value;

    const hasEnoughCharacters =
        password.length >= 8;

    const containsNumber =
        /\d/.test(password);

    lengthRequirement.classList.toggle(
        "valid",
        hasEnoughCharacters
    );

    lengthRequirement.classList.toggle(
        "invalid",
        password.length > 0 &&
            !hasEnoughCharacters
    );

    numberRequirement.classList.toggle(
        "valid",
        containsNumber
    );

    numberRequirement.classList.toggle(
        "invalid",
        password.length > 0 &&
            !containsNumber
    );
}

function validatePasswordMatch() {
    if (!confirmPassword.value) {
        return;
    }

    if (
        registerPassword.value ===
        confirmPassword.value
    ) {
        confirmPassword.setCustomValidity("");
    } else {
        confirmPassword.setCustomValidity(
            "Passwords do not match."
        );
    }
}

loginTab.addEventListener(
    "click",
    showLogin
);

registerTab.addEventListener(
    "click",
    showRegister
);

switchAuthButton.addEventListener(
    "click",
    switchAuthView
);

themeToggle.addEventListener(
    "click",
    toggleTheme
);

document
    .querySelectorAll(".password-toggle")
    .forEach((button) => {
        button.addEventListener(
            "click",
            () =>
                togglePasswordVisibility(
                    button
                )
        );
    });

registerPassword.addEventListener(
    "input",
    () => {
        updatePasswordRequirements();
        validatePasswordMatch();
        clearMessages();
    }
);

confirmPassword.addEventListener(
    "input",
    () => {
        validatePasswordMatch();
        clearMessages();
    }
);

loginForm.addEventListener(
    "input",
    clearMessages
);

registerForm.addEventListener(
    "input",
    clearMessages
);

loadTheme();
showLogin();
updatePasswordRequirements();
updateIcons();