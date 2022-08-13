import styled from "styled-components";
import Flex from "./flex";

const Info = styled(Flex)`
  font-size: 12px;
  color: ${(props) => props.theme.textSecondary};
  svg {
    margin-right: 4px;
  }
`;

export default Info;
