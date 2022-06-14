import React from "react";
import styled from "styled-components";
import { primary_purple_500 } from "next-common/styles/colors";
import { p_12_medium } from "next-common/styles/componentCss";

const Text = styled.div`
  user-select: none;
  ${p_12_medium};
  color: ${primary_purple_500};
  &:hover {
    cursor: pointer;
  }
`;

function ToggleText({ isSetBanner, setIsSetBanner = () => {} }) {
  const handleSwitch = () => {
    setIsSetBanner(!isSetBanner);
  };

  return (
    <Text onClick={handleSwitch}>{isSetBanner ? "Cancel" : "Set Banner"}</Text>
  );
}

export default ToggleText;
