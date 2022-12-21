import styled from "styled-components";
import Flex from "../flex";

export const GreyPanel = styled(Flex)`
  background: ${(p) => p.theme.grey100Bg};
  border-radius: 4px;
`;
