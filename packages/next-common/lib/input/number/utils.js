// https://github.com/cchanxzy/react-currency-input-field/tree/main/src/components/utils

export const numberInputUtils = {
  formatValue,
  repositionCursor,
  count,
  cleanValue,
  getLocaleConfig,
};

function count(str = "", char = "") {
  return Math.max(0, String(str).split(char).length - 1);
}

function cleanValue(value = "", { allowDecimals = true, decimalSeparator }) {
  return String(value).replace(
    new RegExp(`[^0-9${allowDecimals ? decimalSeparator : ""}]`, "g"),
    "",
  );
}

function formatValue(value = "", { decimalSeparator }) {
  if (value === "") {
    return "";
  }

  if (String(value).startsWith(decimalSeparator)) {
    value = "0" + value;
  }

  const formatter = new Intl.NumberFormat(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 20,
  });

  let formatted;
  if (String(value).indexOf(decimalSeparator) >= 0) {
    const [int, decimal = ""] = value.split(decimalSeparator);
    const formattedInt = formatter.format(int);

    formatted = `${formattedInt}${decimalSeparator}${decimal || ""}`;
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
  groupSeparator,
  decimalSeparator,
}) {
  value = String(value);

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

    // if deleting the .(decimal separator) , re-calculate the position
    if (
      (lastKeyStroke === "Backspace" || lastKeyStroke === "Delete") &&
      stateValue[cursorPosition] === decimalSeparator
    ) {
      const [, decimal] = stateValue.split(decimalSeparator);
      const formattedDecimal = formatValue(decimal, { decimalSeparator });
      const groupSeparators = count(formattedDecimal, groupSeparator);

      cursorPosition -= groupSeparators;
    }

    // if adding the .(decimal separator) in anywhere, re-calculate the position
    if (lastKeyStroke === decimalSeparator) {
      const rightString = stateValue.slice(cursorPosition);
      const groupSeparators = count(rightString, groupSeparator);

      cursorPosition += groupSeparators;
    }

    modifiedValue = splitValue.join("");

    return { modifiedValue, cursorPosition };
  }

  return { modifiedValue, cursorPosition: selectionStart };
}

function getLocaleConfig() {
  let groupSeparator = "";
  let decimalSeparator = "";
  const numberFormatter = new Intl.NumberFormat();

  const parts = numberFormatter.formatToParts(1000.1);
  parts.forEach((part) => {
    if (part.type === "group") {
      groupSeparator = part.value;
    } else if (part.type === "decimal") {
      decimalSeparator = part.value;
    }
  });

  return { groupSeparator, decimalSeparator };
}
