import styled, { css } from "styled-components";
import Flex from "../styled/flex";
import { cssSize } from "next-common/utils/cssUtils";

export const AvatarWrapper = styled(Flex)`
  display: flex;
  margin-right: clamp(4px, calc((1em - 12px) * 9999), 8px);
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
  width: ${(p) => cssSize(p.size)};
  height: ${(p) => cssSize(p.size)};
  min-width: ${(p) => cssSize(p.size)};
  min-height: ${(p) => cssSize(p.size)};
  object-fit: cover;
`;
