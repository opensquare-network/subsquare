import React from "react";

import styled, { css } from "styled-components";
import { SystemLoading } from "@osn/icons/subsquare";

const ColorLoadingIcon = styled(SystemLoading)`
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

export default function Loading({ size = 12, color }) {
  return (
    <div className="inline-flex items-center [&_svg_path]:!fill-none">
      <ColorLoadingIcon width={size} height={size} color={color} />
    </div>
  );
}
