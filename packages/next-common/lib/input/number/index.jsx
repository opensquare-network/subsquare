// https://github.com/cchanxzy/react-currency-input-field/blob/main/src/components/CurrencyInput.tsx

import { ArrowUp } from "@osn/icons/subsquare";
import { isNil, noop } from "lodash-es";
import { cn } from "next-common/utils";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import Input from "..";
import { numberInputUtils } from "./utils";
import BigNumber from "bignumber.js";

const NumberInput = forwardRef(NumberInputImpl);
export default NumberInput;

/**
 * @param {NumberInputProps} props
 */
function NumberInputImpl(
  {
    id,
    name,
    defaultValue,
    value: userValue,
    suffix,
    className = "",
    onKeyDown,
    onChange,
    onValueChange,
    allowDecimals = false,
    controls = false,
    keyboard = true,
    step = 1,
    min = 0,
    max = Number.MAX_SAFE_INTEGER,
    ...props
  },
  ref,
) {
  const [stateValue, setStateValue] = useState(
    defaultValue
      ? numberInputUtils.formatValue(defaultValue)
      : userValue
      ? numberInputUtils.formatValue(userValue)
      : "",
  );
  const [cursor, setCursor] = useState(0);
  const [changeCount, setChangeCount] = useState(0);
  const [lastKeyStroke, setLastKeyStroke] = useState(null);

  const inputRef = useRef(null);
  useImperativeHandle(ref, () => inputRef.current);

  if (controls) {
    suffix = (
      <div className="flex flex-col h-full border-l border-neutral300 divide-y divide-neutral300 -mx-[var(--input-affix-gap-x)]">
        <Stepper onClick={handleUp} />
        <Stepper down onClick={handleDown} />
      </div>
    );
  }

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
    if (numberInputUtils.count(value, numberInputUtils.DECIMAL_SEPARATOR) > 1) {
      return;
    }

    const { modifiedValue, cursorPosition } = numberInputUtils.repositionCursor(
      {
        selectionStart,
        value,
        lastKeyStroke,
        stateValue,
      },
    );

    const stringValue = numberInputUtils.cleanValue(modifiedValue, {
      allowDecimals,
    });

    const formattedValue = numberInputUtils.formatValue(stringValue);

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

    if (step && keyboard && (key === "ArrowUp" || key === "ArrowDown")) {
      event.preventDefault();
      setCursor(stateValue.length);

      if (key === "ArrowUp") {
        handleUp();
      }
      if (key === "ArrowDown") {
        handleDown();
      }
    }

    onKeyDown?.(event);
  }

  function handleStep(difference) {
    if (inputRef.current) {
      let { value } = inputRef.current;
      value = numberInputUtils.cleanValue(value, { allowDecimals }) || "0";
      const newValue = BigNumber(value).plus(difference).toString();

      if (BigNumber(newValue).gt(max)) {
        return;
      }

      if (BigNumber(newValue).lt(min)) {
        return;
      }

      processChange(newValue, value.length);
    }
  }

  function handleUp() {
    handleStep(BigNumber(0).plus(step).toString());
  }

  function handleDown() {
    handleStep(BigNumber(0).minus(step).toString());
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
      suffix={suffix}
      {...props}
      onChange={handleOnChange}
      onKeyDown={handleOnKeyDown}
    />
  );
}

function Stepper({ down, onClick = noop }) {
  return (
    <button className="px-4 group" onClick={onClick}>
      <ArrowUp
        className={cn(
          "w-5 h-5",
          "text-textSecondary group-hover:text-textPrimary",
          down && "rotate-180",
        )}
      />
    </button>
  );
}
