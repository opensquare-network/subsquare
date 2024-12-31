// modified, https://github.com/cchanxzy/react-currency-input-field/src/components/utils/repositionCursor.ts

import { formatValue } from "./formatValue";

/**
 * Based on the last key stroke and the cursor position, update the value
 * and reposition the cursor to the right place
 */
export function repositionCursor({
  selectionStart,
  value,
  lastKeyStroke,
  stateValue,
  groupSeparator,
}) {
  function countGroupSeparators(value) {
    let count = 0;
    for (let i = 0; i < value.length; i++) {
      if (value[i] === groupSeparator) {
        count += 1;
      }
    }
    return count;
  }

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
      const count = countGroupSeparators(formattedDecimal);

      cursorPosition -= count;
    }

    // if adding the . in anywhere, re-calculate the position
    if (lastKeyStroke === ".") {
      const rightString = stateValue.slice(cursorPosition);
      const count = countGroupSeparators(rightString);

      cursorPosition += count;
    }

    modifiedValue = splitValue.join("");

    return { modifiedValue, cursorPosition };
  }

  return { modifiedValue, cursorPosition: selectionStart };
}
