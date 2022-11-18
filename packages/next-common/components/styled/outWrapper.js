import styled, { css } from "styled-components";
import { mdcss } from "../../utils/responsive";

const OutWrapper = styled.div`
  display: flex;
  max-width: 1184px;
  margin: 0 auto;
  position: relative;

  ${mdcss(css`
    max-width: 100%;
  `)}
`;

export default OutWrapper;
