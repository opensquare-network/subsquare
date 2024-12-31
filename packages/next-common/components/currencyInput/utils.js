const GROUP_SEPARATOR = ",";
const DECIMAL_SEPARATOR = ".";

export const currencyInputUtils = {
  formatValue,
  repositionCursor,
  count,
  cleanValue,
  GROUP_SEPARATOR,
  DECIMAL_SEPARATOR,
};

function count(str = "", char = "") {
  return Math.max(0, str.split(char).length - 1);
}

function cleanValue(value = "", { allowDecimals = true } = {}) {
  return value.replace(
    new RegExp(`[^0-9${allowDecimals ? DECIMAL_SEPARATOR : ""}]`, "g"),
    "",
  );
}

function formatValue(value = "") {
  if (value === "") {
    return "";
  }

  if (value.startsWith(DECIMAL_SEPARATOR)) {
    value = "0" + value;
  }

  const formatter = new Intl.NumberFormat(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 20,
  });

  let formatted;
  if (value.indexOf(DECIMAL_SEPARATOR) >= 0) {
    const [int, decimal] = value.split(DECIMAL_SEPARATOR);
    const formattedInt = formatter.format(int);
    const [, formattedDecimal] = formatter
      .format(`0.${decimal}`)
      .split(DECIMAL_SEPARATOR);
    formatted = `${formattedInt}.${formattedDecimal}`;
  } else {
    formatted = formatter.format(value);
  }

  return formatted;
}

/**
 * Based on the last key stroke and the cursor position, update the value
 * and reposition the cursor to the right place
 * @link https://github.com/cchanxzy/react-currency-input-field/src/components/utils/repositionCursor.ts
 */
function repositionCursor({
  selectionStart,
  value,
  lastKeyStroke,
  stateValue,
}) {
  let cursorPosition = selectionStart;
  let modifiedValue = value;

  if (stateValue && cursorPosition) {
    const splitValue = value.split("");
    // if cursor is to right of groupSeparator and backspace pressed, delete the character to the left of the separator and reposition the cursor
    if (
      lastKeyStroke === "Backspace" &&
      stateValue[cursorPosition] === GROUP_SEPARATOR
    ) {
      splitValue.splice(cursorPosition - 1, 1);
      cursorPosition -= 1;
    }

    // if cursor is to left of groupSeparator and delete pressed, delete the character to the right of the separator and reposition the cursor
    if (
      lastKeyStroke === "Delete" &&
      stateValue[cursorPosition] === GROUP_SEPARATOR
    ) {
      splitValue.splice(cursorPosition, 1);
      cursorPosition += 1;
    }

    // if deleting the . , re-calculate the position
    if (
      (lastKeyStroke === "Backspace" || lastKeyStroke === "Delete") &&
      stateValue[cursorPosition] === "."
    ) {
      const [, decimal] = stateValue.split(".");
      const formattedDecimal = formatValue(decimal);
      const groupSeparators = count(formattedDecimal, GROUP_SEPARATOR);

      cursorPosition -= groupSeparators;
    }

    // if adding the . in anywhere, re-calculate the position
    if (lastKeyStroke === ".") {
      const rightString = stateValue.slice(cursorPosition);
      const groupSeparators = count(rightString, GROUP_SEPARATOR);

      cursorPosition += groupSeparators;
    }

    modifiedValue = splitValue.join("");

    return { modifiedValue, cursorPosition };
  }

  return { modifiedValue, cursorPosition: selectionStart };
}
