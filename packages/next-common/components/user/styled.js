import styled, { css } from "styled-components";
import Flex from "../styled/flex";

export const AvatarWrapper = styled(Flex)`
  display: flex;
  margin-right: clamp(4px, calc((1em - 12px) * 4), 8px);
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
