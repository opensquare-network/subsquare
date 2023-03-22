import SlashShortcut from "../../assets/imgs/icons/slash-shortcut.svg";
import styled from "styled-components";

const SlashShortIcon = styled(SlashShortcut)`
  path {
    fill: ${(p) => p.theme.textPlaceholder};
  }
  rect {
    stroke: ${(p) => p.theme.textPlaceholder};
  }
`;

export default SlashShortIcon;
