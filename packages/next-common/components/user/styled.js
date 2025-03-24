import styled, { css } from "styled-components";
import Flex from "../styled/flex";

export const AvatarWrapper = styled(Flex)`
  display: flex;
  margin-right: ${1 / 3}rem;
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

  ${(p) =>
    p.noEvent &&
    css`
      pointer-events: none;
    `}
`;

export const AvatarImg = styled.img`
  border-radius: 50%;
  width: ${(p) => p.size};
  height: ${(p) => p.size};
  min-width: ${(p) => p.size};
  min-height: ${(p) => p.size};
  object-fit: cover;
`;
