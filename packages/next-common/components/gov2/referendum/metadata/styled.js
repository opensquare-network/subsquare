import styled from "styled-components";
import Flex from "../../../styled/flex";
import { p_12_normal } from "../../../../styles/componentCss";

export const ValueWrapper = styled(Flex)`
  gap: 8px;
`;

export const GreyText = styled.span`
  display: inline-flex;
  align-items: center;
  color: var(--textTertiary);
  ${p_12_normal};
`;
