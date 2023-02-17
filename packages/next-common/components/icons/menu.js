import styled from "styled-components";
import Menu from "../../assets/imgs/icons/menu.svg";

const MenuIcon = styled(Menu)`
  path {
    stroke: ${(p) => p.theme.textSecondary};
  }

  &:hover {
    path {
      stroke: ${(p) => p.theme.textSecondary};
    }
  }
`;

export default MenuIcon;
