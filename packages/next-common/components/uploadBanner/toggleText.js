import React from "react";
import styled, { css } from "styled-components";
import { primary_purple_500 } from "next-common/styles/colors";
import { p_12_medium } from "next-common/styles/componentCss";

const Text = styled.div`
  user-select: none;
  ${p_12_medium};
  color: ${primary_purple_500};

  &:hover {
    cursor: pointer;
  }

  ${(p) =>
    p.disabled &&
    css`
      color: #9da9bb;
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
