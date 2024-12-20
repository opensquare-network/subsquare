import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import styled from "styled-components";
import Flex from "next-common/components/styled/flex";
import tw from "tailwind-styled-components";

export const Title = tw.span`
  text-textPrimary text16Bold
  ${(p) => p.disabled && "text-textTertiary"}
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
