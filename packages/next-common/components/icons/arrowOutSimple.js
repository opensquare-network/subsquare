import styled from "styled-components";
import ArrowOutSimple from "../../assets/imgs/icons/arrow-out-simple.svg";

const ArrowOutSimpleIcon = styled(ArrowOutSimple)`
  path {
    stroke: var(--textTertiary);
  }

  &:hover {
    path {
      stroke: var(--textSecondary);
    }
  }
`;

export default ArrowOutSimpleIcon;
