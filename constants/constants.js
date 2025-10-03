// ============================================================================
// CONFIGURATION & STATE
// ============================================================================

export const CONFIG = {
  DECIMAL_PRECISION: 6,
  RESERVED_WORDS: ["sin", "cos", "tan", "sqrt", "pi", "e", "Math"],
  OPERATORS: ["+", "-", "*", "/", "^", "(", ")"],
  ERROR_MESSAGES: {
    INVALID_EXPRESSION: "Invalid Expression",
    CALCULATION_ERROR: "Calculation Error",
    NO_VARIABLES: "No variables defined",
    HISTORY_EMPTY: "History is empty",
    VARIABLE_NOT_FOUND: "Variable '{name}' not found",
    UNDEFINED_VARIABLES: "Undefined variables: {vars}",
    INVALID_VARIABLE_NAME:
      "Variable name cannot be a reserved constant or function name",
    INVALID_VARIABLE_VALUE: "Variable value must be a valid number",
    MISSING_INPUT: "Please enter both name and value",
  },
};

export const SELECTORS = {
  INPUT_FIELD: "inputfield",
  NAME_FIELD: "name-field",
  VALUE_FIELD: "value-field",
  ALERT_DIV: "alert",
  VARIABLE_LIST: "variable-list",
  VARIABLE_SELECTION: "variable-selection",
  VARIABLE_DROPDOWN: "variable-dropdown",
  HISTORY_CONTENT: "historyContent",
  HISTORY_MODAL: "historyModal",
  VARIABLE_ITEM: "variable-item",
  VAR_NAME: "var-name",
  VAR_VALUE: "var-value",
  HISTORY_ITEM: "history-item",
  HISTORY_EXPRESSION: "history-expression",
  HISTORY_RESULT: "history-result",
  HISTORY_EMPTY: "history-empty",
  HISTORY_COUNT: "history-count",
};

export const STATE = {
  // Global state
  variables: {},
  history: [],
  historyIndex: 0,
};
