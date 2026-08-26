let currentValue = "0";
let previousValue = "";
let operation = null;
let shouldResetDisplay = false;
let memory = 0;

let history = [];

// ==============================
// DOM Elements
// ==============================

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

const memoryClearButton = document.querySelector(
    '[data-action="memory-clear"]'
);
const memoryRecallButton = document.querySelector(
    '[data-action="memory-recall"]'
);
const memoryAddButton = document.querySelector(
    '[data-action="memory-add"]'
);
const memorySubtractButton = document.querySelector(
    '[data-action="memory-subtract"]'
);

const themeToggle = document.getElementById("themeToggle");

const historyList = document.getElementById("historyList");
const clearHistoryButton = document.getElementById("clearHistory");

// ==============================
// Display
// ==============================

function updateDisplay() {
    currentValueElement.textContent = currentValue;
    previousValueElement.textContent = previousValue;
}

// ==============================
// Number Input
// ==============================

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

// ==============================
// Decimal
// ==============================

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

// ==============================
// Operation
// ==============================

function chooseOperation(selectedOperation) {
    if (currentValue === "Error") {
        return;
    }

    if (operation !== null && !shouldResetDisplay) {
        calculate();
    }

    previousValue = currentValue;
    operation = selectedOperation;
    shouldResetDisplay = true;

    updateDisplay();
}

// ==============================
// Operation Symbols
// ==============================

function getOperationSymbol(operation) {
    switch (operation) {
        case "add":
            return "+";

        case "subtract":
            return "−";

        case "multiply":
            return "×";

        case "divide":
            return "÷";

        default:
            return "";
    }
}

// ==============================
// Calculate
// ==============================

function calculate() {
    if (operation === null || shouldResetDisplay) {
        return;
    }

    const firstNumber = parseFloat(previousValue);
    const secondNumber = parseFloat(currentValue);

    const operationSymbol = getOperationSymbol(operation);

    // Save the expression BEFORE changing the values
    const expression = `${previousValue} ${operationSymbol} ${currentValue}`;

    let result;

    switch (operation) {
        case "add":
            result = firstNumber + secondNumber;
            break;

        case "subtract":
            result = firstNumber - secondNumber;
            break;

        case "multiply":
            result = firstNumber * secondNumber;
            break;

        case "divide":
            if (secondNumber === 0) {
                currentValue = "Error";
                previousValue = "";
                operation = null;
                shouldResetDisplay = true;

                updateDisplay();
                return;
            }

            result = firstNumber / secondNumber;
            break;

        default:
            return;
    }

    currentValue = formatResult(result);

    // Add successful calculation to history
    addToHistory(expression, currentValue);

    previousValue = "";
    operation = null;
    shouldResetDisplay = true;

    updateDisplay();
}

// ==============================
// Format Result
// ==============================

function formatResult(number) {
    if (!Number.isFinite(number)) {
        return "Error";
    }

    const roundedNumber =
        Math.round((number + Number.EPSILON) * 100000000) / 100000000;

    return roundedNumber.toString();
}

// ==============================
// Clear Calculator
// ==============================

function clearCalculator() {
    currentValue = "0";
    previousValue = "";
    operation = null;
    shouldResetDisplay = false;

    updateDisplay();
}

// ==============================
// Backspace
// ==============================

function backspace() {
    if (currentValue === "Error" || shouldResetDisplay) {
        clearCalculator();
        return;
    }

    if (currentValue.length === 1) {
        currentValue = "0";
    } else {
        currentValue = currentValue.slice(0, -1);
    }

    updateDisplay();
}

// ==============================
// Toggle Positive / Negative
// ==============================

function toggleSign() {
    if (currentValue === "0" || currentValue === "Error") {
        return;
    }

    currentValue = currentValue.startsWith("-")
        ? currentValue.slice(1)
        : "-" + currentValue;

    updateDisplay();
}

// ==============================
// Percentage
// ==============================

function calculatePercentage() {
    if (currentValue === "Error") {
        return;
    }

    const number = parseFloat(currentValue);

    if (Number.isNaN(number)) {
        return;
    }

    currentValue = (number / 100).toString();

    updateDisplay();
}

// ==============================
// MEMORY FUNCTIONS
// ==============================

function memoryClear() {
    memory = 0;
}

function memoryRecall() {
    currentValue = memory.toString();
    shouldResetDisplay = false;

    updateDisplay();
}

function memoryAdd() {
    const number = parseFloat(currentValue);

    if (currentValue === "Error" || Number.isNaN(number)) {
        return;
    }

    memory += number;
}

function memorySubtract() {
    const number = parseFloat(currentValue);

    if (currentValue === "Error" || Number.isNaN(number)) {
        return;
    }

    memory -= number;
}

// ==============================
// HISTORY
// ==============================

function addToHistory(expression, result) {
    history.unshift({
        expression: expression,
        result: result
    });

    renderHistory();
}

function renderHistory() {
    if (!historyList) {
        return;
    }

    historyList.innerHTML = "";

    if (history.length === 0) {
        const emptyMessage = document.createElement("p");

        emptyMessage.className = "history-empty";
        emptyMessage.textContent = "No calculations yet";

        historyList.appendChild(emptyMessage);

        return;
    }

    history.forEach(item => {
        const historyItem = document.createElement("div");

        historyItem.className = "history-item";

        historyItem.innerHTML = `
            <div class="history-expression">
                ${item.expression}
            </div>

            <div class="history-result">
                = ${item.result}
            </div>
        `;

        historyList.appendChild(historyItem);
    });
}

function clearHistory() {
    history = [];

    renderHistory();
}

// ==============================
// NUMBER BUTTONS
// ==============================

numberButtons.forEach(button => {
    button.addEventListener("click", () => {
        appendNumber(button.dataset.number);
    });
});

// ==============================
// OPERATION BUTTONS
// ==============================

operationButtons.forEach(button => {
    button.addEventListener("click", () => {
        chooseOperation(button.dataset.operation);
    });
});

// ==============================
// DECIMAL
// ==============================

decimalButton.addEventListener("click", addDecimal);

// ==============================
// EQUALS
// ==============================

equalsButton.addEventListener("click", calculate);

// ==============================
// CLEAR
// ==============================

clearButton.addEventListener("click", clearCalculator);

// ==============================
// BACKSPACE
// ==============================

backspaceButton.addEventListener("click", backspace);

// ==============================
// POSITIVE / NEGATIVE
// ==============================

signButton.addEventListener("click", toggleSign);

// ==============================
// PERCENTAGE
// ==============================

percentageButton.addEventListener("click", calculatePercentage);

// ==============================
// MEMORY BUTTONS
// ==============================

memoryClearButton.addEventListener("click", memoryClear);

memoryRecallButton.addEventListener("click", memoryRecall);

memoryAddButton.addEventListener("click", memoryAdd);

memorySubtractButton.addEventListener("click", memorySubtract);

// ==============================
// THEME TOGGLE
// ==============================

themeToggle.addEventListener("click", () => {
    const currentTheme =
        document.documentElement.getAttribute("data-theme");

    if (currentTheme === "dark") {
        document.documentElement.removeAttribute("data-theme");
    } else {
        document.documentElement.setAttribute("data-theme", "dark");
    }
});

// ==============================
// CLEAR HISTORY BUTTON
// ==============================

if (clearHistoryButton) {
    clearHistoryButton.addEventListener("click", clearHistory);
}

// ==============================
// KEYBOARD SUPPORT
// ==============================

document.addEventListener("keydown", event => {

    // Numbers
    if (event.key >= "0" && event.key <= "9") {
        appendNumber(event.key);
    }

    // Decimal
    if (event.key === ".") {
        addDecimal();
    }

    // Addition
    if (event.key === "+") {
        chooseOperation("add");
    }

    // Subtraction
    if (event.key === "-") {
        chooseOperation("subtract");
    }

    // Multiplication
    if (event.key === "*") {
        chooseOperation("multiply");
    }

    // Division
    if (event.key === "/") {
        event.preventDefault();
        chooseOperation("divide");
    }

    // Equals
    if (event.key === "Enter" || event.key === "=") {
        calculate();
    }

    // Backspace
    if (event.key === "Backspace") {
        backspace();
    }

    // Clear
    if (event.key === "Escape") {
        clearCalculator();
    }

    // Percentage
    if (event.key === "%") {
        calculatePercentage();
    }
});

// ==============================
// INITIAL DISPLAY
// ==============================

updateDisplay();
renderHistory();