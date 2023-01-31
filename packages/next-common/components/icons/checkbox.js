import styled, { css } from "styled-components";
import Checkbox from "../../assets/imgs/icons/check-box-off.svg";

const CheckboxIcon = styled(Checkbox)`
  ${(p) =>
    p.checked &&
    css`
      rect {
        fill: ${(p) => p.theme.primaryPurple500};
      }
    `}
`;

export default CheckboxIcon;
