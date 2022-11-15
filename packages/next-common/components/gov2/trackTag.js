import styled from "styled-components";
import { p_12_medium } from "../../styles/componentCss";
import { parseGov2TrackName } from "../../utils/gov2";

const Tag = styled.span`
  padding: 2px 8px;
  border-radius: 10px;
  color: ${(p) => p.fg || p.theme.textSeondary};
  background-color: ${(p) => p.bg || p.theme.grey100Bg};
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
      {parseGov2TrackName(name)}
    </Tag>
  );
}
