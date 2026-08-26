let currentValue = "0";
let previousValue = "";
let operation = null;
let shouldResetDisplay = false;
let memory = 0;



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
function calculate() {

    if (operation === null || shouldResetDisplay) {
        return;
    }

    const firstNumber = parseFloat(previousValue);
    const secondNumber = parseFloat(currentValue);

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
    previousValue = "";
    operation = null;
    shouldResetDisplay = true;

    updateDisplay();
}
function formatResult(number) {

    if (!Number.isFinite(number)) {
        return "Error";
    }

    const roundedNumber = Math.round((number + Number.EPSILON) * 100000000) / 100000000;

    return roundedNumber.toString();
}
function clearCalculator() {

    currentValue = "0";
    previousValue = "";
    operation = null;
    shouldResetDisplay = false;

    updateDisplay();
}
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

function toggleSign() {

    if (currentValue === "0" || currentValue === "Error") {
        return;
    }

    currentValue = currentValue.startsWith("-")
        ? currentValue.slice(1)
        : "-" + currentValue;

    updateDisplay();
}

function calculatePercentage() {

    if (currentValue === "Error") {
        return;
    }

    const number = parseFloat(currentValue);

    currentValue = (number / 100).toString();

    updateDisplay();
}
// Number buttons
numberButtons.forEach(button => {

    button.addEventListener("click", () => {
        appendNumber(button.dataset.number);
    });

});


// Operation buttons
operationButtons.forEach(button => {

    button.addEventListener("click", () => {
        chooseOperation(button.dataset.operation);
    });

});


// Decimal
decimalButton.addEventListener("click", addDecimal);


// Equals
equalsButton.addEventListener("click", calculate);


// Clear
clearButton.addEventListener("click", clearCalculator);


// Backspace
backspaceButton.addEventListener("click", backspace);


// Positive / Negative
signButton.addEventListener("click", toggleSign);


// Percentage
percentageButton.addEventListener("click", calculatePercentage);

document.addEventListener("keydown", event => {

    if (event.key >= "0" && event.key <= "9") {
        appendNumber(event.key);
    }

    if (event.key === ".") {
        addDecimal();
    }

    if (event.key === "+") {
        chooseOperation("add");
    }

    if (event.key === "-") {
        chooseOperation("subtract");
    }

    if (event.key === "*") {
        chooseOperation("multiply");
    }

    if (event.key === "/") {
        event.preventDefault();
        chooseOperation("divide");
    }

    if (event.key === "Enter" || event.key === "=") {
        calculate();
    }

    if (event.key === "Backspace") {
        backspace();
    }

    if (event.key === "Escape") {
        clearCalculator();
    }

    if (event.key === "%") {
        calculatePercentage();
    }

});