import styled from "styled-components";
import MenuUnFold from "../../assets/imgs/icons/menu-unfold.svg";

const MenuUnFoldIcon = styled(MenuUnFold)`
  path {
    stroke: ${(p) => p.theme.textTeriary};
  }

  &:hover {
    path {
      stroke: ${(p) => p.theme.textSecondary};
    }
  }
`;

export default MenuUnFoldIcon;
