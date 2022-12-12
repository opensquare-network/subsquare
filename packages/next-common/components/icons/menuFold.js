import styled from "styled-components";
import MenuFold from "../../assets/imgs/icons/menu-fold.svg";

const MenuFoldIcon = styled(MenuFold)`
  g {
    stroke: ${(p) => p.theme.textTertiary};
  }

  &:hover {
    path {
      stroke: ${(p) => p.theme.textSecondary};
    }
  }
`;

export default MenuFoldIcon;
