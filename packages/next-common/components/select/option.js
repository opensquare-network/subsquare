import React from "react";
import styled, { css } from "styled-components";
import { light_text_primary } from "../../styles/colors";
import useDarkMode from "../../utils/hooks/useDarkMode";

const OptionWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 0 12px;
  height: 36px;
  font-size: 14px;
  font-weight: 400;
  cursor: pointer;
  color: ${light_text_primary};
  :hover {
    background-color: #f6f7fa;
  }

  ${(p) =>
    p.active &&
    css`
      color: #1e2134;
      background-color: #f6f7fa;
    `}
  ${(props) =>
    props?.theme === "dark" &&
    css`
      background: #212433;
      border-color: #363a4d;
      color: white !important;
      :hover {
        background-color: #1d1e2c;
      }
    `}
`;

function Option({ active = false, children, onClick = () => {}, ...rest }) {
  const [theme] = useDarkMode();
  return (
    <OptionWrapper
      theme={theme}
      role="option"
      active={active}
      onClick={onClick}
      {...rest}
    >
      {children}
    </OptionWrapper>
  );
}

export default Option;
