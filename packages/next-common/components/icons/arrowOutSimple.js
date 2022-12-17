import styled from "styled-components";
import ArrowOutSimple from "../../assets/imgs/icons/arrow-out-simple.svg";

const ArrowOutSimpleIcon = styled(ArrowOutSimple)`
  path {
    stroke: ${(p) => p.theme.textTertiary};
  }

  &:hover {
    path {
      stroke: ${(p) => p.theme.textSecondary};
    }
  }
`;

export default ArrowOutSimpleIcon;
