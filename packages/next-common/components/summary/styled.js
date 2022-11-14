import styled from "styled-components";
import { p_12_bold } from "../../styles/componentCss";
import { SecondaryCard } from "../styled/containers/secondaryCard";

export const SummaryWrapper = styled.div`
  display: flex;

  > :not(:first-child) {
    margin-left: 16px;
  }

  @media screen and (max-width: 768px) {
    flex-direction: column;
    > :not(:first-child) {
      margin-left: 0;
      margin-top: 16px;
    }
  }
`;

export const SummaryCard = styled(SecondaryCard)`
  position: relative;
  color: ${(props) => props.theme.textPrimary};
  flex: 0 1 33.33%;
  height: 88px;
`;

export const SummaryTitle = styled.div`
  letter-spacing: 0.16em;
  color: ${(props) => props.theme.textTertiary};
  margin-bottom: 4px;
  text-transform: uppercase;
  ${p_12_bold};
`;

export const SummaryGreyText = styled.span`
  color: ${(props) => props.theme.textTertiary}; !important;
`;
