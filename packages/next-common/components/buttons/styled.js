import React from "react";
import styled, { css } from "styled-components";

const CommonButton = styled.button`
  all: unset;
  padding: 0 12px;
  height: 38px;
  border-radius: 4px;
  cursor: pointer;
  text-align: center;
  display: inline-block;
  box-sizing: border-box;
  font-weight: 500;
  font-size: 14px;
  ${(p) =>
    p.isFill &&
    css`
      width: 100%;
    `}

  ${(p) =>
    p.isLoading &&
    css`
      pointer-events: none;
    `}
`;

// These kinds of button has a colored background, and the text color is contrast.
export const BackgroundButton = styled(CommonButton)`
  color: ${(props) => props.theme.textContrast};
`;

export const DisabledButton = styled(CommonButton)`
  cursor: not-allowed;
`;

export default CommonButton;
