// packages/next-common/components/balanceInput.js

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import Input from "../input";
import { currencyInputUtils } from "./utils";
import { isNil } from "lodash-es";

const CurrencyInput = forwardRef(CurrencyInputImpl);
export default CurrencyInput;

function CurrencyInputImpl(
  {
    id,
    name,
    defaultValue,
    value: userValue,
    allowDecimals = true,
    className = "",
    onKeyDown,
    onChange,
    onValueChange,
    ...props
  },
  ref,
) {
  const [stateValue, setStateValue] = useState(
    defaultValue
      ? currencyInputUtils.formatValue(defaultValue)
      : userValue
      ? currencyInputUtils.formatValue(userValue)
      : "",
  );
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

  useEffect(() => {
    if (isNil(userValue) && isNil(defaultValue)) {
      setStateValue("");
    }
  }, [userValue, defaultValue]);

  function processChange(value, selectionStart) {
    if (
      currencyInputUtils.count(value, currencyInputUtils.DECIMAL_SEPARATOR) > 1
    ) {
      return;
    }

    const { modifiedValue, cursorPosition } =
      currencyInputUtils.repositionCursor({
        selectionStart,
        value,
        lastKeyStroke,
        stateValue,
      });

    const stringValue = currencyInputUtils.cleanValue(modifiedValue, {
      allowDecimals,
    });

    const formattedValue = currencyInputUtils.formatValue(stringValue);

    if (cursorPosition !== null) {
      // Prevent cursor jumping
      const newCursor = cursorPosition + (formattedValue.length - value.length);

      setCursor(newCursor);
      setChangeCount((c) => c + 1);
    }

    setStateValue(formattedValue);

    if (onValueChange) {
      onValueChange(stringValue, name, {
        value: stringValue,
        formatted: formattedValue,
      });
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
      id={id}
      name={name}
      type="text"
      inputMode="decimal"
      value={stateValue}
      className={className}
      {...props}
      onChange={handleOnChange}
      onKeyDown={handleOnKeyDown}
    />
  );
}
