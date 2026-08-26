let currentValue = "0";
let previousValue = "";
let operation = null;
let shouldResetDisplay = false;

const currentValueElement = document.getElementById("currentValue");
const previousValueElement = document.getElementById("previousValue");

const numberButtons = document.querySelectorAll("[data-number]");
const operationButtons = document.querySelectorAll("[data-operation]");

const clearButton = document.querySelector('[data-action="clear"]');
const decimalButton = document.querySelector('[data-action="decimal"]');
const backspaceButton = document.querySelector('[data-action="backspace"]');
const equalsButton = document.querySelector('[data-action="equals"]');
const signButton = document.querySelector('[data-action="toggle-sign"]');
const percentageButton = document.querySelector('[data-action="percentage"]');

const themeToggle = document.getElementById("themeToggle");

function updateDisplay() {
    currentValueElement.textContent = currentValue;
    previousValueElement.textContent = previousValue;
}

function appendNumber(number) {

    if (currentValue === "Error") {
        currentValue = number;
        shouldResetDisplay = false;
        updateDisplay();
        return;
    }

    if (shouldResetDisplay) {
        currentValue = number;
        shouldResetDisplay = false;
    } else if (currentValue === "0") {
        currentValue = number;
    } else {
        currentValue += number;
    }

    updateDisplay();
}

function addDecimal() {

    if (currentValue === "Error") {
        currentValue = "0.";
        shouldResetDisplay = false;
        updateDisplay();
        return;
    }

    if (shouldResetDisplay) {
        currentValue = "0.";
        shouldResetDisplay = false;
        updateDisplay();
        return;
    }

    if (!currentValue.includes(".")) {
        currentValue += ".";
    }

    updateDisplay();
}
