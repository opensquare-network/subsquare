import styled from "styled-components";
import { pretty_scroll_bar } from "next-common/styles/componentCss";

const ScrollerX = styled.div`
  display: flex;
  overflow-x: auto;
  ${pretty_scroll_bar};
`;

export default ScrollerX;
