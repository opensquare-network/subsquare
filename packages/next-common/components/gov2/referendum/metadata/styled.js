import styled from "styled-components";
import Flex from "../../../styled/flex";
import tw from "tailwind-styled-components";

export const ValueWrapper = styled(Flex)`
  font-weight: 500;
  gap: 8px;
`;

export const GreyText = tw.span`
  inline-flex items-center
  text-textTertiary text14Medium
`;

export const RefundWrapper = styled.div`
  font-weight: 500;
  color: var(--textTertiary);
  &::before {
    content: "·";
    color: var(--textTertiary);
    padding-right: 8px;
  }

  a {
    color: var(--theme500);
  }
`;
