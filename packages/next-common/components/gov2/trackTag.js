import styled, { useTheme } from "styled-components";
import { p_12_medium } from "../../styles/componentCss";
import { parseGov2TrackName } from "../../utils/gov2";

const Tag = styled.span`
  padding: 2px 8px;
  border-radius: 10px;
  color: ${(p) => p.theme.textSeondary};
  background-color: ${(p) => p.theme.grey100Bg};
  ${p_12_medium};
`;

export default function Gov2TrackTag({ name = "" }) {
  const {} = useTheme();

  return <Tag>{parseGov2TrackName(name)}</Tag>;
}
