import { usePageProps } from "next-common/context/page";
import { startCase } from "lodash-es";
import tw from "tailwind-styled-components";

const Background = tw.span`
  bg-neutral200
  py-0.5 px-2
  rounded-[10px]
  text-textSecondary text12Medium
`;

export default function Track({ id, className = "" }) {
  const { tracks } = usePageProps();
  const track = tracks.find((track) => track.id === id);
  if (!track) {
    return <Background className={className}>{`[${id}]`}</Background>;
  }

  const trackName = startCase(track.name);
  return (
    <Background className={className}>{`[${id}] ${trackName}`}</Background>
  );
}
