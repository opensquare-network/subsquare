import React from "react";
import styled from "styled-components";
import { p_12_medium } from "../../styles/componentCss";
import startCase from "lodash.startcase";

const Tag = styled.span`
  padding: 2px 8px;
  border-radius: 10px;
  color: ${(p) => p.fg || "var(--textSecondary)"};
  background-color: ${(p) => p.bg || "var(--neutral200)"};
  ${p_12_medium};
`;

export default function Gov2TrackTag({ name = "" }) {
  const makeColorPair = (fg, bg) => ({ fg, bg });

  // NOTE: these colors support dark mode
  const trackColor = {
    root: makeColorPair("#4caf91", "rgba(76, 175, 145, 0.1)"),
  };

  return (
    <Tag fg={trackColor[name]?.fg} bg={trackColor[name]?.bg}>
      {startCase(name)}
    </Tag>
  );
}
