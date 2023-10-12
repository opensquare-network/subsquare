import { usePageProps } from "next-common/context/page";
import startCase from "lodash.startcase";
import styled from "styled-components";
import { p_12_medium } from "next-common/styles/componentCss";

const Background = styled.span`
  background: var(--neutral200);
  padding: 2px 8px;
  border-radius: 10px;
  color: var(--textSecondary);
  ${p_12_medium}
`;

export default function Track({ id }) {
  const { tracks } = usePageProps();
  const track = tracks.find((track) => track.id === id);
  if (!track) {
    return <Background>{`[${id}]`}</Background>;
  }

  const trackName = startCase(track.name);
  return <Background>{`[${id}] ${trackName}`}</Background>;
}
