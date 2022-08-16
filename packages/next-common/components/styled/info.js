import styled from "styled-components";
import Flex from "./flex";

const Info = styled(Flex)`
  font-size: 12px;
  color: ${(props) => props.theme.textSecondary};
  svg {
    margin-right: 4px;
    path {
      stroke: ${(props) => props.theme.textTertiary};
    }
  }
`;

export default Info;
