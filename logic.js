// Calculator state
let variables = {};
let history = [];
let historyIndex = 0;

// Utility functions
const isOperator = (char) => ["+", "-", "*", "/", "^", "(", ")"].includes(char);
const isNumber = (char) => !isNaN(parseFloat(char)) || char === ".";

// Safe evaluation using Function constructor (more secure than eval)
function safeEvaluate(expression) {
  try {
    // Replace mathematical functions with Math equivalents
    let safeExpr = expression
      .replace(/sin\(/g, "Math.sin(")
      .replace(/cos\(/g, "Math.cos(")
      .replace(/tan\(/g, "Math.tan(")
      .replace(/sqrt\(/g, "Math.sqrt(")
      .replace(/pi/gi, "Math.PI")
      .replace(/e/gi, "Math.E");

    // Create a safe function with only Math operations
    const func = new Function("Math", `return ${safeExpr}`);
    const result = func(Math);

    // Check for valid numeric result
    if (typeof result === "number" && !isNaN(result) && isFinite(result)) {
      return result;
    }
    return null;
  } catch (error) {
    console.error("Evaluation error:", error);
    return null;
  }
}

// Variable substitution in expressions
function substituteVariables(expression) {
  let result = expression;

  // Sort variables by length (longest first) to avoid partial replacements
  const sortedVars = Object.keys(variables).sort((a, b) => b.length - a.length);

  for (const varName of sortedVars) {
    // Use word boundaries to avoid partial replacements
    const regex = new RegExp(
      `\\b${varName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`,
      "g"
    );
    result = result.replace(regex, variables[varName]);
  }

  return result;
}

// Main calculation function
function calculateResult() {
  const inputField = document.getElementById("inputfield");
  let expression = inputField.value.trim();

  if (!expression) return;

  // Add to history
  history.push(expression);

  try {
    // Substitute variables first
    let processedExpression = substituteVariables(expression);

    // Evaluate the expression
    const result = safeEvaluate(processedExpression);

    if (result === null) {
      inputField.value = "Invalid Expression";
      return;
    }

    // Add result to history
    history.push(result.toString());
    historyIndex = history.length - 2;

    // Display result with better formatting
    const formattedResult = Number.isInteger(result)
      ? result
      : parseFloat(result).toFixed(6);
    inputField.value += "\n= " + formattedResult;
  } catch (error) {
    inputField.value = "Calculation Error";
  }
}

// UI Functions
function setValue(value) {
  const inputField = document.getElementById("inputfield");
  inputField.value += value;
}

// Show available variables in calculator
function showVariables() {
  const inputField = document.getElementById("inputfield");
  if (Object.keys(variables).length === 0) {
    inputField.value = "No variables defined";
    return;
  }

  let varList = "Available Variables:\n";
  for (const [name, value] of Object.entries(variables)) {
    varList += `${name} = ${value}\n`;
  }
  inputField.value = varList;
}

// Clear calculator and show variables
function clr() {
  const inputField = document.getElementById("inputfield");
  inputField.value = "";

  // Show available variables if any exist
  if (Object.keys(variables).length > 0) {
    setTimeout(() => {
      showVariables();
    }, 100);
  }
}

function displayContent() {
  calculateResult();
}

// Variable management
function addVariable() {
  const nameField = document.getElementById("name-field");
  const valueField = document.getElementById("value-field");
  const alertDiv = document.getElementById("alert");
  const variableList = document.getElementById("variable-list");

  const name = nameField.value.trim();
  const value = valueField.value.trim();

  if (!name || !value) {
    alert("Please enter both name and value");
    return;
  }

  // Check if name is a reserved constant
  if (
    ["pi", "PI", "e", "E", "sin", "cos", "tan", "sqrt"].includes(
      name.toLowerCase()
    )
  ) {
    alertDiv.style.display = "block";
    alertDiv.textContent =
      "Variable name cannot be a reserved constant or function name";
    return;
  }

  // Validate that value is a number
  if (isNaN(parseFloat(value))) {
    alertDiv.style.display = "block";
    alertDiv.textContent = "Variable value must be a valid number";
    return;
  }

  // Add variable
  variables[name] = parseFloat(value);

  // Clear input fields
  nameField.value = "";
  valueField.value = "";

  // Hide alert
  alertDiv.style.display = "none";

  // Update variable list
  updateVariableList();
}

function updateVariableList() {
  const variableList = document.getElementById("variable-list");
  variableList.innerHTML = "";

  for (const [name, value] of Object.entries(variables)) {
    const varDiv = document.createElement("div");
    varDiv.className = "variable-item";

    const nameSpan = document.createElement("span");
    nameSpan.className = "var-name";
    nameSpan.textContent = name;

    const valueSpan = document.createElement("span");
    valueSpan.className = "var-value";
    valueSpan.textContent = value;

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "btn btn-danger btn-sm";
    deleteBtn.textContent = "×";
    deleteBtn.onclick = function () {
      removeVariable(name);
    };

    varDiv.appendChild(nameSpan);
    varDiv.appendChild(valueSpan);
    varDiv.appendChild(deleteBtn);
    variableList.appendChild(varDiv);
  }
}

function removeVariable(name) {
  delete variables[name];
  updateVariableList();
}

// History management
function navigateHistory(direction) {
  if (direction === "prev" && historyIndex > 0) {
    historyIndex -= 2;
  } else if (direction === "next" && historyIndex + 2 < history.length) {
    historyIndex += 2;
  }

  showHistory();
}

function deleteHistoryItem() {
  if (historyIndex < history.length) {
    history.splice(historyIndex, 2);
    if (historyIndex >= history.length) {
      historyIndex = Math.max(0, history.length - 2);
    }
  }
  showHistory();
}

function showHistory() {
  const inputField = document.getElementById("inputfield");

  if (history.length === 0) {
    inputField.value = "History is empty";
    return;
  }

  if (historyIndex < history.length) {
    const expression = history[historyIndex] || "";
    const result = history[historyIndex + 1] || "";
    inputField.value = `${expression} = ${result}`;
  }
}

// Enhanced history display in popup modal
function displayHistory() {
  const historyContent = document.getElementById("historyContent");
  const historyModal = document.getElementById("historyModal");

  // Clear previous content
  historyContent.innerHTML = "";

  if (history.length === 0) {
    const emptyDiv = document.createElement("div");
    emptyDiv.className = "history-empty";
    emptyDiv.textContent = "No calculation history available";
    historyContent.appendChild(emptyDiv);
  } else {
    let calculationCount = 0;

    for (let i = 0; i < history.length; i += 2) {
      const expression = history[i];
      const result = history[i + 1];
      if (expression && result) {
        calculationCount++;

        // Create history item container
        const historyItem = document.createElement("div");
        historyItem.className = "history-item";

        // Create expression element
        const expressionDiv = document.createElement("div");
        expressionDiv.className = "history-expression";
        expressionDiv.textContent = `${calculationCount}. ${expression}`;

        // Create result element
        const resultDiv = document.createElement("div");
        resultDiv.className = "history-result";
        resultDiv.textContent = `= ${result}`;

        // Append elements
        historyItem.appendChild(expressionDiv);
        historyItem.appendChild(resultDiv);
        historyContent.appendChild(historyItem);
      }
    }

    // Add total count
    const totalDiv = document.createElement("div");
    totalDiv.style.textAlign = "center";
    totalDiv.style.marginTop = "1rem";
    totalDiv.style.color = "#718096";
    totalDiv.style.fontSize = "0.9rem";
    totalDiv.textContent = `Total calculations: ${calculationCount}`;
    historyContent.appendChild(totalDiv);
  }

  // Show the modal
  historyModal.style.display = "flex";
}

// Close history modal
function closeHistoryModal() {
  const historyModal = document.getElementById("historyModal");
  historyModal.style.display = "none";
}

// Clear history completely
function clearAllHistory() {
  history = [];
  historyIndex = 0;
  const inputField = document.getElementById("inputfield");
  inputField.value = "History cleared";

  // Update the modal content and close it
  const historyContent = document.getElementById("historyContent");
  historyContent.innerHTML = "";

  const emptyDiv = document.createElement("div");
  emptyDiv.className = "history-empty";
  emptyDiv.textContent = "No calculation history available";
  historyContent.appendChild(emptyDiv);

  closeHistoryModal();
}

// Show calculation statistics
function showStats() {
  const inputField = document.getElementById("inputfield");
  const totalCalculations = Math.floor(history.length / 2);
  const totalVariables = Object.keys(variables).length;

  let statsText = "Calculator Statistics\n";
  statsText += "═".repeat(30) + "\n\n";
  statsText += `Total calculations: ${totalCalculations}\n`;
  statsText += `Variables defined: ${totalVariables}\n`;

  if (totalVariables > 0) {
    statsText += "\nAvailable Variables:\n";
    for (const [name, value] of Object.entries(variables)) {
      statsText += `   ${name} = ${value}\n`;
    }
  }

  if (totalCalculations > 0) {
    statsText += "\nRecent calculations:\n";
    const recentCount = Math.min(3, totalCalculations);
    for (
      let i = history.length - 2;
      i >= Math.max(0, history.length - 6);
      i -= 2
    ) {
      const expression = history[i];
      const result = history[i + 1];
      if (expression && result) {
        statsText += `   ${expression} = ${result}\n`;
      }
    }
  }

  inputField.value = statsText;
}

// Event handlers
function addVariables() {
  addVariable();
}

function deleteHistory() {
  navigateHistory("prev");
}

function addHistory() {
  navigateHistory("next");
}

function RemoveHistoryItem() {
  deleteHistoryItem();
}

// Handle keyboard input
function handleKeyPress(event) {
  const key = event.key;

  // Allow typing in the input field
  if (key === "Enter") {
    event.preventDefault();
    displayContent();
  } else if (key === "Escape") {
    event.preventDefault();
    clr();
  }
}

// Initialize calculator
document.addEventListener("DOMContentLoaded", function () {
  // Enable typing in calculator
  const inputField = document.getElementById("inputfield");
  inputField.readOnly = false;
  inputField.focus();

  // Add keyboard event listener
  inputField.addEventListener("keydown", handleKeyPress);

  // Initialize variable list
  updateVariableList();

  // Add modal event listeners
  const historyModal = document.getElementById("historyModal");

  // Close modal when clicking outside
  historyModal.addEventListener("click", function (event) {
    if (event.target === historyModal) {
      closeHistoryModal();
    }
  });

  // Close modal with Escape key
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && historyModal.style.display === "flex") {
      closeHistoryModal();
    }
  });
});
