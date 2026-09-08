const themeToggle = document.getElementById("themeToggle");

let currentTheme = "light";

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

themeToggle.addEventListener("click", toggleTheme);