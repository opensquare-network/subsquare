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
  color: ${(props) => props.theme.textPrimary};
  background-color: white;
  border: 1px solid ${(props) => props.theme.grey200Border};
`;

export default function InvalidPreImage() {
  return (
    <Wrapper>
      <WarningIcon />
      <span>Invalid image</span>
    </Wrapper>
  );
}
