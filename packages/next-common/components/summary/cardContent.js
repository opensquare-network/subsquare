import styled from "styled-components";
import { p_16_bold } from "../../styles/componentCss";

const Content = styled.div`
  color: var(--textPrimary);
  ${p_16_bold};

  > .unit {
    color: var(--textTertiary);
  }

  > .total {
    font-size: 12px;
    color: var(--textTertiary);
  }

  > .upper {
    text-transform: uppercase;
  }

  > :not(:first-child) {
    margin-left: 4px;
  }
`;

export default Content;
