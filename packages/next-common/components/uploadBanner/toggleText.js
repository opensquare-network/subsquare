import React from "react";
import styled, { css } from "styled-components";
import { p_12_medium } from "next-common/styles/componentCss";

const Text = styled.button`
  user-select: none;
  ${p_12_medium};
  color: var(--purple500);
  background-color: transparent;
  border: none;

  &:hover {
    cursor: pointer;
  }

  ${(p) =>
    p.disabled &&
    css`
      color: var(--textTertiary);
      cursor: not-allowed !important;
    `}
`;

function ToggleText({
  disabled = false,
  isSetBanner,
  setIsSetBanner = () => {},
}) {
  const handleSwitch = () => {
    if (disabled) {
      return;
    }

    setIsSetBanner(!isSetBanner);
  };

  return (
    <Text disabled={disabled} onClick={handleSwitch}>
      {isSetBanner ? "Cancel" : "Set Banner"}
    </Text>
  );
}

export default ToggleText;
