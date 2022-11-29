import styled, { css } from "styled-components";
import { p_12_bold } from "../../styles/componentCss";
import { SecondaryCard } from "../styled/containers/secondaryCard";

export const SummaryWrapper = styled.div`
  display: flex;
  gap: 16px;

  @media screen and (max-width: 768px) {
    flex-direction: column;
  }
`;

export const SummaryCard = styled(SecondaryCard)`
  position: relative;
  color: ${(props) => props.theme.textPrimary};
  height: 88px;
  flex: 1;
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

export const Button = styled.div`
  cursor: pointer;

  ${(p) =>
    p.disabled &&
    css`
      pointer-events: none;
    `}

  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  color: ${(p) => (p.disabled ? p.theme.textSecondary : p.theme.textPrimary)};

  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4px 12px;
  gap: 4px;
  background: ${(p) => p.theme.neutral};
  border: 1px solid ${(p) => p.theme.grey300Border};
  border-radius: 4px;
  :hover {
    border-color: ${(p) => p.theme.grey400Border};
  }

  svg {
    path {
      stroke: ${(p) =>
        p.disabled ? p.theme.textSecondary : p.theme.textPrimary};
    }
  }
`;
