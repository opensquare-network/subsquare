import React from "react";
import styled, { css } from "styled-components";

const OptionWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 0 12px;
  height: 36px;
  font-size: 14px;
  font-weight: 400;
  cursor: pointer;
  color: ${(props) => props.theme.textPrimary};
  background: ${(props) => props.theme.neutral};
  border-color: ${(props) => props.theme.grey300Border};
  :hover {
    background-color: ${(props) => props.theme.grey100Bg};
  }

  ${(p) =>
    p.active &&
    css`
      color: ${(props) => props.theme.textPrimary};
      background-color: ${(props) => props.theme.grey100Bg};
    `}
`;

function Option({ active = false, children, onClick = () => {}, ...rest }) {
  return (
    <OptionWrapper role="option" active={active} onClick={onClick} {...rest}>
      {children}
    </OptionWrapper>
  );
}

export default Option;
