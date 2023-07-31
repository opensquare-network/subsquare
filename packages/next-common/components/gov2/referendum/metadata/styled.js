import styled from "styled-components";
import Flex from "../../../styled/flex";
import { p_14_medium } from "../../../../styles/componentCss";

export const ValueWrapper = styled(Flex)`
  font-weight: 500;
  gap: 8px;
`;

export const GreyText = styled.span`
  display: inline-flex;
  align-items: center;
  color: var(--textTertiary);
  ${p_14_medium};
`;
