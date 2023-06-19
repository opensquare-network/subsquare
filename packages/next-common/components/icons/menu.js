import styled from "styled-components";
import Menu from "../../assets/imgs/icons/menu.svg";

const MenuIcon = styled(Menu)`
  path {
    stroke: var(--textSecondary);
  }

  &:hover {
    path {
      stroke: var(--textSecondary);
    }
  }
`;

export default MenuIcon;
