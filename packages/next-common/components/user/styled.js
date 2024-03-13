import styled, { css } from "styled-components";
import Flex from "../styled/flex";

export const AvatarWrapper = styled(Flex)`
  display: flex;
  margin-right: ${(p) => (p.fontSize <= 12 ? "4px" : "8px")};
  svg {
    circle:first-child {
      fill: var(--neutral200);
    }
  }
`;

export const UserWrapper = styled(Flex)`
  max-width: 100%;
  a {
    &:hover {
      text-decoration: underline;
    }
  }

  a,
  div {
    ${(p) =>
      p.color
        ? css`
            color: ${p.color};
          `
        : css`
            color: var(--textPrimary);
          `}
  }

  ${(p) =>
    p.noEvent &&
    css`
      pointer-events: none;
    `}
`;

export const LinkWrapper = styled.a`
  width: max-content;
  ${(p) =>
    p.color
      ? css`
          color: ${p.color} !important;
          text-decoration-color: ${p.color} !important;
        `
      : css`
          color: var(--textPrimary) !important;
          text-decoration-color: var(--textPrimary) !important;
        `}
  display: flex;
  align-items: center;
  :hover {
    text-decoration: underline;
    cursor: pointer;
  }
`;
