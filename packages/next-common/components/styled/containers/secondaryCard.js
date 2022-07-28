import React from "react";
import styled from "styled-components";

export const SecondaryCard = styled.div`
  background: ${(props) => props.theme.neutral};
  border: 1px solid ${(props) => props.theme.grey200Border};
  box-shadow: ${(props) => props.theme.shadow100};
  border-radius: 6px;
  padding: 24px;
  > :not(:first-child) {
    margin-top: 16px;
  }
`;

// Used for cards on detail page
export const SecondaryCardDetail = styled(SecondaryCard)`
  @media screen and (max-width: 768px) {
    border-radius: 0;
  }
`;
