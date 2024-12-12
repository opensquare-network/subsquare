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

export const AvatarImg = styled.img`
  border-radius: 50%;
  width: ${(p) => p.size}px;
  height: ${(p) => p.size}px;
  min-width: ${(p) => p.size}px;
  min-height: ${(p) => p.size}px;
  object-fit: cover;
`;
