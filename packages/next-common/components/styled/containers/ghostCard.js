import React from "react";
import styled from "styled-components";

export const GhostCard = styled.div`
  background: ${(props) => props.theme.grey200Border};
  border-radius: 8px;
  padding: 24px;

  @media screen and (max-width: 768px) {
    border-radius: 0;
  }
`;
