// packages/next-common/components/balanceInput.js

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import Input from "../input";
import { repositionCursor } from "./repositionCursor";
import { formatValue } from "./formatValue";

const GROUP_SEPARATOR = ",";

const CurrencyInput = forwardRef(CurrencyInputImpl);
export default CurrencyInput;

function CurrencyInputImpl(
  {
    defaultValue = "",
    allowDecimals = true,
    className = "",
    onKeyDown,
    onChange,
    // onValueChange,
  },
  ref,
) {
  const [stateValue, setStateValue] = useState(defaultValue);
  const [cursor, setCursor] = useState(0);
  const [changeCount, setChangeCount] = useState(0);
  const [lastKeyStroke, setLastKeyStroke] = useState(null);

  const inputRef = useRef(null);
  useImperativeHandle(ref, () => inputRef.current);

  useEffect(() => {
    if (inputRef.current && document.activeElement === inputRef.current) {
      inputRef.current.setSelectionRange(cursor, cursor);
    }
  }, [cursor, inputRef, changeCount]);

  function processChange(value, selectionStart) {
    if (hasDuplicatedDots(value)) {
      return;
    }

    const { modifiedValue, cursorPosition } = repositionCursor({
      selectionStart,
      value,
      lastKeyStroke,
      stateValue,
      groupSeparator: GROUP_SEPARATOR,
    });

    const numericValue = modifiedValue.replace(
      new RegExp(`[^0-9${allowDecimals ? "." : ""}]`, "g"),
      "",
    );

    if (numericValue) {
      let formattedValue = formatValue(numericValue);

      if (numericValue.indexOf(".") >= 0) {
        const [int, decimal] = numericValue.split(".");
        formattedValue = `${formatValue(int)}.${decimal}`;
      }

      setStateValue(formattedValue);

      if (cursorPosition !== null) {
        // Prevent cursor jumping
        const newCursor =
          cursorPosition + (formattedValue.length - value.length);

        setCursor(newCursor);
        setChangeCount((c) => c + 1);
      }
    } else {
      setStateValue("");
    }
  }

  function handleOnChange(event) {
    const {
      target: { value, selectionStart },
    } = event;

    processChange(value, selectionStart);

    onChange?.(event);
  }

  function handleOnKeyDown(event) {
    const { key } = event;
    setLastKeyStroke(key);

    onKeyDown?.(event);
  }

  return (
    <Input
      ref={inputRef}
      type="text"
      inputMode="decimal"
      value={stateValue}
      className={className}
      onChange={handleOnChange}
      onKeyDown={handleOnKeyDown}
    />
  );
}

function hasDuplicatedDots(str = "") {
  const firstDotIndex = str.indexOf(".");
  const lastDotIndex = str.lastIndexOf(".");
  return lastDotIndex !== firstDotIndex;
}
