const dashboardUsername =
    document.getElementById(
        "dashboardUsername"
    );

const profileUsername =
    document.getElementById(
        "profileUsername"
    );

const profileEmail =
    document.getElementById(
        "profileEmail"
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

const avatarInitials =
    document.getElementById(
        "avatarInitials"
    );

const loggedInAt =
    document.getElementById(
        "loggedInAt"
    );

const sessionStatus =
    document.getElementById(
        "sessionStatus"
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

function updateIcons() {
    if (window.lucide) {
        lucide.createIcons();
    }
}

function getInitials(username) {
    if (!username) {
        return "U";
    }

    const parts =
        username
            .trim()
            .split(/\s+/)
            .filter(Boolean);

    if (parts.length === 1) {
        return parts[0]
            .slice(0, 2)
            .toUpperCase();
    }

    return (
        parts[0][0] +
        parts[
            parts.length - 1
        ][0]
    ).toUpperCase();
}

function formatLoginTime(value) {
    if (!value) {
        return "Current session";
    }

    const date =
        new Date(value);

    if (
        Number.isNaN(
            date.getTime()
        )
    ) {
        return "Current session";
    }

    return date.toLocaleString(
        undefined,
        {
            dateStyle: "medium",
            timeStyle: "short"
        }
    );
}

function displayUserSession(data) {
    const user = data.user;

    dashboardUsername.textContent =
        user.username;

    profileUsername.textContent =
        user.username;

    profileEmail.textContent =
        user.email;

    accountUsername.textContent =
        user.username;

    accountEmail.textContent =
        user.email;

    accountId.textContent =
        String(user.id);

    avatarInitials.textContent =
        getInitials(
            user.username
        );

    loggedInAt.textContent =
        formatLoginTime(
            data.loggedInAt
        );

    sessionStatus.innerHTML = `
        <span class="status-dot"></span>
        Session Active
    `;
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

        displayUserSession(data);
    } catch {
        sessionStatus.innerHTML = `
            <span class="status-dot"></span>
            Session unavailable
        `;

        dashboardUsername.textContent =
            "User";

        profileUsername.textContent =
            "Unable to load account";

        profileEmail.textContent =
            "Session unavailable";

        accountUsername.textContent =
            "Unavailable";

        accountEmail.textContent =
            "Unavailable";

        accountId.textContent =
            "Unavailable";

        loggedInAt.textContent =
            "Unavailable";
    }
}

function updateThemeIcon() {
    const icon =
        currentTheme === "dark"
            ? "sun"
            : "moon";

    dashboardThemeToggle.innerHTML =
        `<i data-lucide="${icon}"></i>`;

    dashboardThemeToggle.setAttribute(
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
        currentTheme =
            savedTheme;
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

function setLogoutLoading(
    loading
) {
    logoutLoading = loading;

    logoutButton.disabled =
        loading;

    if (loading) {
        logoutButton.innerHTML = `
            <span>Logging out...</span>
        `;
    } else {
        logoutButton.innerHTML = `
            <i data-lucide="log-out"></i>
            <span>Logout</span>
        `;
    }

    updateIcons();
}

async function handleLogout() {
    if (logoutLoading) {
        return;
    }

    setLogoutLoading(true);

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
            setLogoutLoading(false);
            return;
        }

        window.location.replace("/");
    } catch {
        setLogoutLoading(false);
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
updateIcons();