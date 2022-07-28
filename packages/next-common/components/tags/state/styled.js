import React from "react";
import styled from "styled-components";

const Common = styled.span`
  padding: 4px 8px;
  font-size: 12px;
  font-weight: 500;
  border-radius: 4px;
  color: ${(props) => props.theme.textContrast};
`;

export const StartTag = styled(Common)`
  background: ${(props) => props.theme.secondaryAzure500};
`;

export const MotionTag = styled(Common)`
  background: ${(props) => props.theme.primaryPurple500};
`;

export const ActiveTag = styled(Common)`
  background: ${(props) => props.theme.secondaryBlue500};
`;

export const PositiveTag = styled(Common)`
  background: ${(props) => props.theme.secondaryGreen500};
`;

export const NegativeTag = styled(Common)`
  background: ${(props) => props.theme.secondaryRed500};
`;

export const ClosedTag = styled(Common)`
  background: ${(props) => props.theme.grey400Border};
`;
