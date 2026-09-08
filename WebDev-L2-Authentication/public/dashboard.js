const dashboardUsername =
    document.getElementById(
        "dashboardUsername"
    );

const accountUsername =
    document.getElementById(
        "accountUsername"
    );

const accountEmail =
    document.getElementById(
        "accountEmail"
    );

const accountId =
    document.getElementById(
        "accountId"
    );

const sessionStatus =
    document.getElementById(
        "sessionStatus"
    );

const loggedInAt =
    document.getElementById(
        "loggedInAt"
    );

const sessionTimeLeft =
    document.getElementById(
        "sessionTimeLeft"
    );

const dashboardThemeToggle =
    document.getElementById(
        "dashboardThemeToggle"
    );

const logoutButton =
    document.getElementById(
        "logoutButton"
    );

const THEME_STORAGE_KEY =
    "lockr-theme";

let currentTheme = "light";
let logoutLoading = false;
let sessionExpiresAt = null;
let sessionTimer = null;

function formatSessionTime(value) {
    if (!value) {
        return "--:--";
    }

    const date =
        new Date(value);

    if (
        Number.isNaN(
            date.getTime()
        )
    ) {
        return "--:--";
    }

    return date.toLocaleTimeString(
        [],
        {
            hour: "2-digit",
            minute: "2-digit"
        }
    );
}

function formatTimeLeft(milliseconds) {
    if (milliseconds <= 0) {
        return "00H 00M";
    }

    const totalMinutes =
        Math.ceil(
            milliseconds /
            60000
        );

    const hours =
        Math.floor(
            totalMinutes / 60
        );

    const minutes =
        totalMinutes % 60;

    return `${String(hours).padStart(
        2,
        "0"
    )}H ${String(minutes).padStart(
        2,
        "0"
    )}M`;
}

function updateSessionTimeLeft() {
    if (!sessionExpiresAt) {
        sessionTimeLeft.textContent =
            "--";

        return;
    }

    const remaining =
        sessionExpiresAt.getTime() -
        Date.now();

    sessionTimeLeft.textContent =
        formatTimeLeft(
            remaining
        );

    if (remaining <= 0) {
        clearInterval(
            sessionTimer
        );

        window.location.replace(
            "/"
        );
    }
}

function displaySession(data) {
    const user =
        data.user;

    dashboardUsername.textContent =
        user.username;

    accountUsername.textContent =
        user.username;

    accountEmail.textContent =
        user.email;

    accountId.textContent =
        `ID / ${user.id}`;

    sessionStatus.textContent =
        "ACTIVE";

    loggedInAt.textContent =
        formatSessionTime(
            data.loggedInAt
        );

    sessionExpiresAt =
        new Date(
            data.expiresAt
        );

    updateSessionTimeLeft();

    sessionTimer =
        setInterval(
            updateSessionTimeLeft,
            30000
        );
}

async function loadSession() {
    try {
        const response =
            await fetch(
                "/api/session",
                {
                    method: "GET",
                    headers: {
                        "Accept":
                            "application/json"
                    }
                }
            );

        if (!response.ok) {
            window.location.replace(
                "/"
            );

            return;
        }

        const data =
            await response.json();

        if (
            !data.authenticated ||
            !data.user
        ) {
            window.location.replace(
                "/"
            );

            return;
        }

        displaySession(
            data
        );
    } catch {
        window.location.replace(
            "/"
        );
    }
}

function updateThemeControl() {
    dashboardThemeToggle.textContent =
        currentTheme === "dark"
            ? "LIGHT MODE"
            : "DARK MODE";

    dashboardThemeToggle.setAttribute(
        "aria-label",
        currentTheme === "dark"
            ? "Switch to light mode"
            : "Switch to dark mode"
    );
}

function applyTheme() {
    document.documentElement.setAttribute(
        "data-theme",
        currentTheme
    );

    updateThemeControl();
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
        currentTheme =
            savedTheme;
    } else if (
        window.matchMedia &&
        window.matchMedia(
            "(prefers-color-scheme: dark)"
        ).matches
    ) {
        currentTheme =
            "dark";
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

function setLogoutLoading(
    loading
) {
    logoutLoading =
        loading;

    logoutButton.disabled =
        loading;

    logoutButton.textContent =
        loading
            ? "LOGGING OUT"
            : "LOGOUT";
}

async function handleLogout() {
    if (logoutLoading) {
        return;
    }

    setLogoutLoading(
        true
    );

    try {
        const response =
            await fetch(
                "/api/logout",
                {
                    method: "POST",
                    headers: {
                        "Accept":
                            "application/json"
                    }
                }
            );

        if (!response.ok) {
            setLogoutLoading(
                false
            );

            return;
        }

        window.location.replace(
            "/"
        );
    } catch {
        setLogoutLoading(
            false
        );
    }
}

dashboardThemeToggle.addEventListener(
    "click",
    toggleTheme
);

logoutButton.addEventListener(
    "click",
    handleLogout
);

loadTheme();
loadSession();