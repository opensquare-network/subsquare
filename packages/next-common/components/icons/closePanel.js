import styled from "styled-components";
import ClosePanel from "../../assets/imgs/icons/close-panel.svg";

/**
 * @alias icons/16-state-reject
 */
const ClosePanelIcon = styled(ClosePanel)`
  path {
    stroke: ${(p) => p.theme.textTertiary};
  }
`;

export default ClosePanelIcon;
