import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import styled from "styled-components";
import tw from "tailwind-styled-components";

export const Title = tw.div`
  text16Medium text-textPrimary
  ml-6
`;

export const ListCard = styled(SecondaryCard)`
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  margin-left: -24px;
  a:hover {
    text-decoration: underline;
  }
`;

export const Index = styled.span`
  font-style: normal;
  font-weight: 500;
  ::after {
    content: "·";
    line-height: 22.4px;
    color: var(--textTertiary);
    margin: 0 8px;
  }
`;
