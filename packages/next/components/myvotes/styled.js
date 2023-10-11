import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import { p_16_bold } from "next-common/styles/componentCss";
import styled, { css } from "styled-components";
import Flex from "next-common/components/styled/flex";

export const Title = styled.div`
  margin-left: 24px;
  color: var(--textPrimary);
  ${p_16_bold}
  ${(p) =>
    p.disabled &&
    css`
      color: var(--textTertiary);
    `}
`;

export const ListCard = styled(SecondaryCard)`
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  a:hover {
    text-decoration: underline;
  }
`;

export const Index = styled.span`
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  ::after {
    content: "·";
    font-size: 16px;
    line-height: 22.4px;
    color: var(--textTertiary);
    margin: 0 8px;
  }
`;

export const VoteForItemWrapper = styled(Flex)`
  flex-direction: column;
  gap: 8px;
  align-items: flex-start;
`;
