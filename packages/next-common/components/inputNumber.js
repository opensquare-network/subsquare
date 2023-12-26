import React from "react";
import InputOrigin from "./input";
import styled from "styled-components";
import noop from "lodash.noop";
import DividerOrigin from "./styled/layout/divider";
import Caret from "./icons/caret";
import tw from "tailwind-styled-components";

const Divider = styled(DividerOrigin)`
  background-color: var(--neutral400);
`;

const TwNumberController = tw.div`
  flex flex-col
  w-[46px] h-full
  border-none
`;
const NumberController = styled(TwNumberController)`
  box-shadow: -1px 0 0 0 var(--neutral400);
`;

const NumberStepper = tw.button`
  flex items-center justify-center flex-1
  border-none
  bg-transparent
  cursor-pointer
`;

const Input = styled(InputOrigin)`
  &:hover {
    ${NumberController} {
      box-shadow: -1px 0 0 0 var(--neutral500);
      ${Divider} {
        background-color: var(--neutral500);
      }
    }
  }
`;

export default function InputNumber({
  min = -Infinity,
  max = Infinity,
  value,
  setValue = noop,
  step = 1,
}) {
  function handleChange(e) {
    const raw = e.target.value;
    const n = Number(raw);

    // allow empty
    if (raw === "") {
      setValue(raw);
    } else {
      if (!isNaN(n)) {
        setValue(n);
      }
    }
  }

  function handleUp() {
    if (value >= max) return;
    if (isNaN(value)) {
      setValue(0);
      return;
    }
    setValue(+value + step);
  }

  function handleDown() {
    if (value <= min) return;
    if (isNaN(value)) {
      setValue(0);
      return;
    }
    setValue(+value - step);
  }

  function onBlur() {
    if (Number(value) < min) setValue(min);
    if (Number(value) > max) setValue(max);
  }

  return (
    <Input
      inputMode="numeric"
      value={value}
      onChange={handleChange}
      suffix={
        <NumberController>
          <NumberStepper onClick={handleUp}>
            <Caret down={false} />
          </NumberStepper>
          <Divider />
          <NumberStepper onClick={handleDown}>
            <Caret />
          </NumberStepper>
        </NumberController>
      }
      suffixStyle={{ right: 0, height: "100%" }}
      onBlur={onBlur}
    />
  );
}
