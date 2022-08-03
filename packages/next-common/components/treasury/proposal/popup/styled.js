import React from "react";
import styled from "styled-components";

export const TextBox = styled.div`
  display: flex;
  padding: 12px 16px;

  background: ${(props) => props.theme.grey100Bg};

  border: 1px solid ${(props) => props.theme.grey200Border};
  box-sizing: border-box;
  border-radius: 4px;
  font-size: 14px;
`;
