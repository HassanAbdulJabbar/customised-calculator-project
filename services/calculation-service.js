/**
 * Modern Calculator - Simplified and Optimized
 * A streamlined calculator with variable support and history management
 */

import { CONFIG, SELECTORS, STATE } from "../constants/constants.js";

// ============================================================================
// CORE FUNCTIONS
// ============================================================================

/**
 * Safely evaluate mathematical expressions
 */
function safeEvaluate(expression) {
  try {
    const safeExpr = expression
      .replace(/sin\(/g, "Math.sin(")
      .replace(/cos\(/g, "Math.cos(")
      .replace(/tan\(/g, "Math.tan(")
      .replace(/sqrt\(/g, "Math.sqrt(")
      .replace(/pi/gi, "Math.PI")
      .replace(/e/gi, "Math.E");

    const func = new Function("Math", `return ${safeExpr}`);
    const result = func(Math);

    if (typeof result === "number" && !isNaN(result) && isFinite(result)) {
      return Number.isInteger(result)
        ? result
        : parseFloat(result).toFixed(CONFIG.DECIMAL_PRECISION);
    }
    return null;
  } catch (error) {
    console.error("Evaluation error:", error);
    return null;
  }
}

/**
 * Substitute variables in expression with validation
 */
function substituteVariables(expression) {
  const varPattern = /\b[a-zA-Z_][a-zA-Z0-9_]*\b/g;
  const foundVars = expression.match(varPattern) || [];

  const potentialVars = foundVars.filter(
    (varName) =>
      !CONFIG.RESERVED_WORDS.includes(varName.toLowerCase()) &&
      !varName.startsWith("Math.")
  );

  const undefinedVars = potentialVars.filter(
    (varName) => !(varName in STATE.variables)
  );

  if (undefinedVars.length > 0) {
    return {
      error: true,
      message: CONFIG.ERROR_MESSAGES.UNDEFINED_VARIABLES.replace(
        "{vars}",
        undefinedVars.join(", ")
      ),
    };
  }

  let result = expression;
  const sortedVars = Object.keys(STATE.variables).sort(
    (a, b) => b.length - a.length
  );

  for (const varName of sortedVars) {
    const regex = new RegExp(
      `\\b${varName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`,
      "g"
    );
    result = result.replace(regex, STATE.variables[varName]);
  }

  return { error: false, expression: result };
}

/**
 * Main calculation function
 */
function calculateResult() {
  const inputField = document.getElementById(SELECTORS.INPUT_FIELD);
  const expression = inputField.value.trim();

  if (!expression) return;

  STATE.history.push(expression);

  const substitutionResult = substituteVariables(expression);

  if (substitutionResult.error) {
    inputField.value = substitutionResult.message;
    return;
  }

  const result = safeEvaluate(substitutionResult.expression);

  if (result === null) {
    inputField.value = CONFIG.ERROR_MESSAGES.INVALID_EXPRESSION;
    return;
  }

  STATE.history.push(result.toString());
  STATE.historyIndex = STATE.history.length - 2;
  inputField.value += `\n= ${result}`;
}

// ============================================================================
// UI FUNCTIONS
// ============================================================================

/**
 * Set value in input field
 */
function setValue(value) {
  document.getElementById(SELECTORS.INPUT_FIELD).value += value;
}

/**
 * Clear input and show variables if any exist
 */
function clr() {
  const inputField = document.getElementById(SELECTORS.INPUT_FIELD);
  inputField.value = "";

  if (Object.keys(STATE.variables).length > 0) {
    setTimeout(showVariables, 100);
  }
}

/**
 * Show available variables
 */
function showVariables() {
  const inputField = document.getElementById(SELECTORS.INPUT_FIELD);

  if (Object.keys(STATE.variables).length === 0) {
    inputField.value = CONFIG.ERROR_MESSAGES.NO_VARIABLES;
    return;
  }

  let varList = "Available Variables:\n";
  for (const [name, value] of Object.entries(STATE.variables)) {
    varList += `${name} = ${value}\n`;
  }
  inputField.value = varList;
}

/**
 * Insert variable into expression
 */
function insertVariable(varName) {
  const inputField = document.getElementById(SELECTORS.INPUT_FIELD);

  if (varName in STATE.variables) {
    inputField.value += varName;
  } else {
    inputField.value = CONFIG.ERROR_MESSAGES.VARIABLE_NOT_FOUND.replace(
      "{name}",
      varName
    );
  }
}

/**
 * Insert selected variable from dropdown
 */
function insertSelectedVariable() {
  const dropdown = document.getElementById(SELECTORS.VARIABLE_DROPDOWN);
  if (dropdown && dropdown.value) {
    insertVariable(dropdown.value);
  }
}

// ============================================================================
// VARIABLE MANAGEMENT
// ============================================================================

/**
 * Add a new variable
 */
function addVariable() {
  const alertDiv = document.getElementById(SELECTORS.ALERT_DIV);
  const nameField = document.getElementById(SELECTORS.NAME_FIELD);
  const valueField = document.getElementById(SELECTORS.VALUE_FIELD);

  const name = nameField.value.trim();
  const value = valueField.value.trim();

  if (!name || !value) {
    alert(CONFIG.ERROR_MESSAGES.MISSING_INPUT);
    return;
  }

  const reservedNames = ["pi", "PI", "e", "E", "sin", "cos", "tan", "sqrt"];
  if (reservedNames.includes(name.toLowerCase())) {
    alertDiv.classList.add("show");
    alertDiv.textContent = CONFIG.ERROR_MESSAGES.INVALID_VARIABLE_NAME;
    return;
  }

  if (isNaN(parseFloat(value))) {
    alertDiv.classList.add("show");
    alertDiv.textContent = CONFIG.ERROR_MESSAGES.INVALID_VARIABLE_VALUE;
    return;
  }

  STATE.variables[name] = parseFloat(value);
  nameField.value = "";
  valueField.value = "";
  alertDiv.classList.remove("show");
  updateVariableList();
}

/**
 * Update variable list and dropdown
 */
function updateVariableList() {
  const variableList = document.getElementById(SELECTORS.VARIABLE_LIST);
  const variableSelection = document.getElementById(
    SELECTORS.VARIABLE_SELECTION
  );
  const variableDropdown = document.getElementById(SELECTORS.VARIABLE_DROPDOWN);

  variableList.innerHTML = "";
  variableDropdown.innerHTML = '<option value="">Select a variable...</option>';

  for (const [name, value] of Object.entries(STATE.variables)) {
    // Add to variable list
    const varDiv = document.createElement("div");
    varDiv.className = SELECTORS.VARIABLE_ITEM;

    const nameSpan = document.createElement("span");
    nameSpan.className = SELECTORS.VAR_NAME;
    nameSpan.textContent = name;

    const valueSpan = document.createElement("span");
    valueSpan.className = SELECTORS.VAR_VALUE;
    valueSpan.textContent = value;

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "btn btn-danger btn-sm";
    deleteBtn.textContent = "×";
    deleteBtn.onclick = () => removeVariable(name);

    varDiv.appendChild(nameSpan);
    varDiv.appendChild(valueSpan);
    varDiv.appendChild(deleteBtn);
    variableList.appendChild(varDiv);

    // Add to dropdown
    const option = document.createElement("option");
    option.value = name;
    option.textContent = `${name} = ${value}`;
    variableDropdown.appendChild(option);
  }

  variableSelection.classList.toggle(
    "hidden",
    Object.keys(STATE.variables).length === 0
  );
}

/**
 * Remove variable
 */
function removeVariable(name) {
  delete STATE.variables[name];
  updateVariableList();
}

// ============================================================================
// HISTORY MANAGEMENT
// ============================================================================

/**
 * Navigate through history
 */
function navigateHistory(direction) {
  if (direction === "prev" && STATE.historyIndex > 0) {
    STATE.historyIndex -= 2;
  } else if (
    direction === "next" &&
    STATE.historyIndex + 2 < STATE.history.length
  ) {
    STATE.historyIndex += 2;
  }
  showHistory();
}

/**
 * Show current history item
 */
function showHistory() {
  const inputField = document.getElementById(SELECTORS.INPUT_FIELD);

  if (STATE.history.length === 0) {
    inputField.value = CONFIG.ERROR_MESSAGES.HISTORY_EMPTY;
    return;
  }

  if (STATE.historyIndex < STATE.history.length) {
    const expression = STATE.history[STATE.historyIndex] || "";
    const result = STATE.history[STATE.historyIndex + 1] || "";
    inputField.value = `${expression} = ${result}`;
  }
}

/**
 * Display history in modal
 */
function displayHistory() {
  const historyContent = document.getElementById(SELECTORS.HISTORY_CONTENT);
  const historyModal = document.getElementById(SELECTORS.HISTORY_MODAL);

  if (!historyContent || !historyModal) {
    console.error("History modal elements not found!");
    return;
  }

  historyContent.innerHTML = "";

  if (STATE.history.length === 0) {
    const emptyDiv = document.createElement("div");
    emptyDiv.className = SELECTORS.HISTORY_EMPTY;
    emptyDiv.textContent = "No calculation history available";
    historyContent.appendChild(emptyDiv);
  } else {
    let calculationCount = 0;

    for (let i = 0; i < STATE.history.length; i += 2) {
      const expression = STATE.history[i];
      const result = STATE.history[i + 1];

      if (expression && result) {
        calculationCount++;

        const historyItem = document.createElement("div");
        historyItem.className = SELECTORS.HISTORY_ITEM;

        const expressionDiv = document.createElement("div");
        expressionDiv.className = SELECTORS.HISTORY_EXPRESSION;
        expressionDiv.textContent = `${calculationCount}. ${expression}`;

        const resultDiv = document.createElement("div");
        resultDiv.className = SELECTORS.HISTORY_RESULT;
        resultDiv.textContent = `= ${result}`;

        historyItem.appendChild(expressionDiv);
        historyItem.appendChild(resultDiv);
        historyContent.appendChild(historyItem);
      }
    }

    const totalDiv = document.createElement("div");
    totalDiv.className = SELECTORS.HISTORY_COUNT;
    totalDiv.textContent = `Total calculations: ${calculationCount}`;
    historyContent.appendChild(totalDiv);
  }

  historyModal.classList.add("show");
  console.log("History modal shown");
}

/**
 * Close history modal
 */
function closeHistoryModal() {
  const historyModal = document.getElementById(SELECTORS.HISTORY_MODAL);
  if (historyModal) {
    historyModal.classList.remove("show");
    console.log("History modal closed");
  }
}

/**
 * Clear all history
 */
function clearAllHistory() {
  STATE.history = [];
  STATE.historyIndex = 0;
  document.getElementById(SELECTORS.INPUT_FIELD).value = "History cleared";

  const historyContent = document.getElementById(SELECTORS.HISTORY_CONTENT);
  historyContent.innerHTML = "";

  const emptyDiv = document.createElement("div");
  emptyDiv.className = SELECTORS.HISTORY_EMPTY;
  emptyDiv.textContent = "No calculation history available";
  historyContent.appendChild(emptyDiv);

  closeHistoryModal();
}

// ============================================================================
// STATISTICS
// ============================================================================

/**
 * Show calculation statistics
 */
function showStats() {
  const inputField = document.getElementById(SELECTORS.INPUT_FIELD);
  const totalCalculations = Math.floor(STATE.history.length / 2);
  const totalVariables = Object.keys(STATE.variables).length;

  let statsText = "Calculator Statistics\n";
  statsText += "═".repeat(30) + "\n\n";
  statsText += `Total calculations: ${totalCalculations}\n`;
  statsText += `Variables defined: ${totalVariables}\n`;

  if (totalVariables > 0) {
    statsText += "\nAvailable Variables:\n";
    for (const [name, value] of Object.entries(STATE.variables)) {
      statsText += `   ${name} = ${value}\n`;
    }
  }

  if (totalCalculations > 0) {
    statsText += "\nRecent calculations:\n";
    const recentCount = Math.min(3, totalCalculations);
    for (
      let i = STATE.history.length - 2;
      i >= Math.max(0, STATE.history.length - 6);
      i -= 2
    ) {
      const expression = STATE.history[i];
      const result = STATE.history[i + 1];
      if (expression && result) {
        statsText += `   ${expression} = ${result}\n`;
      }
    }
  }

  inputField.value = statsText;
}

// ============================================================================
// EVENT HANDLERS
// ============================================================================

/**
 * Handle keyboard input
 */
function handleKeyPress(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    displayContent();
  } else if (event.key === "Escape") {
    event.preventDefault();
    clr();
  }
}

// ============================================================================
// LEGACY FUNCTION ALIASES (for backward compatibility)
// ============================================================================

const displayContent = calculateResult;
const addVariables = addVariable;
const deleteHistory = () => navigateHistory("prev");
const addHistory = () => navigateHistory("next");

const deleteHistoryItem = () => {
  if (STATE.historyIndex < STATE.history.length) {
    STATE.history.splice(STATE.historyIndex, 2);
    if (STATE.historyIndex >= STATE.history.length) {
      STATE.historyIndex = Math.max(0, STATE.history.length - 2);
    }
  }
  showHistory();
};
const RemoveHistoryItem = deleteHistoryItem;

// ============================================================================
// EXPOSE FUNCTIONS TO GLOBAL SCOPE (for HTML onclick attributes)
// ============================================================================

// Make functions available globally for HTML onclick attributes
window.clr = clr;
window.setValue = setValue;
window.showStats = showStats;
window.addHistory = addHistory;
window.addVariables = addVariables;
window.showVariables = showVariables;
window.deleteHistory = deleteHistory;
window.displayContent = displayContent;
window.displayHistory = displayHistory;
window.clearAllHistory = clearAllHistory;
window.navigateHistory = navigateHistory;
window.closeHistoryModal = closeHistoryModal;
window.RemoveHistoryItem = RemoveHistoryItem;
window.insertSelectedVariable = insertSelectedVariable;

// ============================================================================
// INITIALIZATION
// ============================================================================

document.addEventListener("DOMContentLoaded", function () {
  const inputField = document.getElementById(SELECTORS.INPUT_FIELD);

  // Ensure input field is properly configured
  if (inputField) {
    inputField.focus();
    inputField.addEventListener("keydown", handleKeyPress);
  } else {
    console.error("Input field not found!");
  }

  updateVariableList();

  const historyModal = document.getElementById(SELECTORS.HISTORY_MODAL);

  if (historyModal) {
    historyModal.addEventListener("click", function (event) {
      if (event.target === historyModal) {
        closeHistoryModal();
      }
    });
  }

  document.addEventListener("keydown", function (event) {
    if (
      event.key === "Escape" &&
      historyModal &&
      historyModal.classList.contains("show")
    ) {
      closeHistoryModal();
    }
  });
});
