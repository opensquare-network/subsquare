export const currencyInputUtils = {
  formatValue,
  repositionCursor,
  count,
  cleanValue,
};

function count(str = "", char = "") {
  return Math.max(0, str.split(char).length - 1);
}

function cleanValue(value = "", { allowDecimals, decimalSeparator }) {
  return value.replace(
    new RegExp(`[^0-9${allowDecimals ? decimalSeparator : ""}]`, "g"),
    "",
  );
}

function formatValue(value = "") {
  if (value.startsWith(".")) {
    value = "0" + value;
  }

  const formatter = new Intl.NumberFormat(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 20,
  });

  return formatter.format(value);
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
  groupSeparator,
}) {
  let cursorPosition = selectionStart;
  let modifiedValue = value;

  if (stateValue && cursorPosition) {
    const splitValue = value.split("");
    // if cursor is to right of groupSeparator and backspace pressed, delete the character to the left of the separator and reposition the cursor
    if (
      lastKeyStroke === "Backspace" &&
      stateValue[cursorPosition] === groupSeparator
    ) {
      splitValue.splice(cursorPosition - 1, 1);
      cursorPosition -= 1;
    }

    // if cursor is to left of groupSeparator and delete pressed, delete the character to the right of the separator and reposition the cursor
    if (
      lastKeyStroke === "Delete" &&
      stateValue[cursorPosition] === groupSeparator
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
      const groupSeparators = count(formattedDecimal, groupSeparator);

      cursorPosition -= groupSeparators;
    }

    // if adding the . in anywhere, re-calculate the position
    if (lastKeyStroke === ".") {
      const rightString = stateValue.slice(cursorPosition);
      const groupSeparators = count(rightString, groupSeparator);

      cursorPosition += groupSeparators;
    }

    modifiedValue = splitValue.join("");

    return { modifiedValue, cursorPosition };
  }

  return { modifiedValue, cursorPosition: selectionStart };
}
