import Curve from "../../assets/imgs/icons/curve.svg";
import styled from "styled-components";

const CurveIcon = styled(Curve)`
  path {
    stroke: ${(p) => p.theme.textTertiary};
  }
`;

export default CurveIcon;
