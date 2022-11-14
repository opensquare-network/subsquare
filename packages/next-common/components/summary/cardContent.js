import styled from "styled-components";
import { p_16_bold } from "../../styles/componentCss";

const Content = styled.div`
  color: ${(props) => props.theme.textPrimary};
  ${p_16_bold};

  > .unit {
    color: ${(props) => props.theme.textTertiary};
  }

  > .total {
    font-size: 12px;
    color: ${(props) => props.theme.textTertiary};
  }

  > .upper {
    text-transform: uppercase;
  }

  > :not(:first-child) {
    margin-left: 4px;
  }
`;

export default Content;
