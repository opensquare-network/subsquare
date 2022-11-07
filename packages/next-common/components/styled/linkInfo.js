import styled from "styled-components";
import Info from "./info";

const LinkInfo = styled(Info)`
  cursor: pointer;
  :hover {
    text-decoration: underline;
  }
`;

export default LinkInfo;
