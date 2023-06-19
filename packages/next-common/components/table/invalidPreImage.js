import React from "react";
import styled from "styled-components";
import Flex from "../styled/flex";
import WarningIcon from "./warning.svg";

const Wrapper = styled(Flex)`
  justify-content: center;
  padding: 12px;
  gap: 8px;
  font-size: 14px;
  line-height: 140%;
  color: var(--textPrimary);
  background-color: var(--neutral100);
  border: 1px solid var(--neutral300);
`;

export default function InvalidPreImage() {
  return (
    <Wrapper>
      <WarningIcon />
      <span>Invalid image</span>
    </Wrapper>
  );
}
