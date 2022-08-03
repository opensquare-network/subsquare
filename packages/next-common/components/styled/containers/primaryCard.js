import React from "react";
import styled from "styled-components";
import { shadow_100 } from "../../../styles/componentCss";

export const PrimaryCard = styled.div`
  background: ${(props) => props.theme.neutral};
  border: 1px solid ${(props) => props.theme.grey200Border};
  ${shadow_100};
  border-radius: 6px;
  padding: 48px;
  color: ${(props) => props.theme.textPrimary};

  @media screen and (max-width: 768px) {
    padding: 24px;
    border-radius: 0;
  }
`;
