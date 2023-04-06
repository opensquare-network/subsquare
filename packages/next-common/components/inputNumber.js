import React from "react";
import InputOrigin from "./input";
import {
  border_hidden,
  cursor_pointer,
  flex,
  flex_1,
  flex_col,
  h_full,
  items_center,
  justify_center,
  theme,
  w,
} from "../styles/tailwindcss";
import styled from "styled-components";
import noop from "lodash.noop";
import DividerOrigin from "./styled/layout/divider";
import Caret from "./icons/caret";

const Divider = styled(DividerOrigin)`
  background-color: ${theme("grey300Border")};
`;

const NumberController = styled.div`
  ${flex};
  ${flex_col};
  ${w(46)};
  ${h_full};
  ${border_hidden};
  box-shadow: -1px 0 0 0 ${theme("grey300Border")};
`;

const NumberSteper = styled.button`
  ${flex};
  ${items_center};
  ${justify_center};
  ${border_hidden};
  background-color: transparent;
  ${cursor_pointer};
  ${flex_1};
`;

const Input = styled(InputOrigin)`
  &:hover {
    ${NumberController} {
      box-shadow: -1px 0 0 0 ${theme("grey400Border")};
      ${Divider} {
        background-color: ${theme("grey400Border")};
      }
    }
  }
`;

export default function InputNumber({
  min = 0,
  max = Infinity,
  value,
  setValue = noop,
  step = 1,
}) {
  function handleChange(e) {
    const v = Number(e.target.value);
    if (typeof v === "number" && !isNaN(v)) {
      setValue(v);
    }
  }

  function handleUp() {
    if (value >= max) return;
    setValue((v) => v + step);
  }

  function handleDown() {
    if (value <= min) return;
    setValue((v) => v - step);
  }

  return (
    <Input
      inputMode="numeric"
      value={value}
      onChange={handleChange}
      suffix={
        <NumberController>
          <NumberSteper onClick={handleUp}>
            <Caret down={false} />
          </NumberSteper>
          <Divider />
          <NumberSteper onClick={handleDown}>
            <Caret />
          </NumberSteper>
        </NumberController>
      }
      suffixStyle={{ right: 0, height: "100%" }}
    />
  );
}
