import styled from "styled-components";
import MenuFold from "../../assets/imgs/icons/menu-fold.svg";

const MenuFoldIcon = styled(MenuFold)`
  g {
    stroke: var(--textTertiary);
  }

  &:hover {
    path {
      stroke: var(--textSecondary);
    }
  }
`;

export default MenuFoldIcon;
