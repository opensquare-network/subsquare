import styled from "styled-components";
import MenuUnFold from "../../assets/imgs/icons/menu-unfold.svg";

const MenuUnFoldIcon = styled(MenuUnFold)`
  g {
    stroke: var(--textTertiary);
  }

  &:hover {
    path {
      stroke: var(--textSecondary);
    }
  }
`;

export default MenuUnFoldIcon;
