import styled from "styled-components";

const Wrapper = styled.span`
  display: inline-flex;

  svg {
    path {
      fill: ${(p) => p.theme.textSecondary};
    }
  }
`;

/**
 * @description `textSecondary`
 */
export default function MenuIconWrapper({ children }) {
  return <Wrapper>{children}</Wrapper>;
}

/**
 * @description `textSecondary`
 */
export function wrapMenuIcon(icon) {
  return <MenuIconWrapper>{icon}</MenuIconWrapper>;
}
