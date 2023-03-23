import styled from "styled-components";
import Magnifying from "../../assets/imgs/icons/magnifying.svg";

const MagnifyingIcon = styled(Magnifying)`
  g {
    stroke: ${(p) => p.theme.textTertiary};
  }
`;

export default MagnifyingIcon;
