import { noop } from "lodash-es";
import React from "react";
import styled from "styled-components";
import Input from "./input";

const Wrapper = styled.div`
  flex-grow: 1;
  overflow: hidden;
  color: var(--textDisabled);
`;

export default function LineInput({
  disabled = false,
  value,
  setValue = noop,
  placeholder = "",
  style = {},
}) {
  return (
    <Wrapper>
      <Input
        style={style}
        disabled={disabled}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </Wrapper>
  );
}
