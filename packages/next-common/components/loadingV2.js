import React from "react";

import styled, { css } from "styled-components";
import LoadingIcon from "../assets/imgs/icons/loadingV2.svg";

const ColorLoadingIcon = styled(LoadingIcon)`
  // rotate 360deg in 1s
  @keyframes rotate {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  animation: rotate 1s linear infinite;

  > path {
    // default color is textPlaceholder
    stroke: var(--textDisabled);
  }

  ${(p) =>
    p.color &&
    css`
      > path {
        stroke: ${p.color};
      }
    `}
`;

export default function LoadingV2({ size = 12, color }) {
  return (
    <ColorLoadingIcon
      width={size}
      height={size}
      color={color}
      viewBox="0 0 24 24"
    />
  );
}
