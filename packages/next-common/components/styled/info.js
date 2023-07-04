import styled from "styled-components";
import Flex from "./flex";

const Info = styled(Flex)`
  font-size: 12px;
  color: var(--textSecondary);
  svg {
    margin-right: 4px;
    path {
      stroke: var(--textTertiary);
    }
  }
`;

export default Info;
