import FellowshipInductedFeed from "next-common/components/fellowship/feeds/events/inducted";

export default function FellowshipCoreFeedsInductedEvent({ feed }) {
  const { args: { who } = {} } = feed || {};

  return <FellowshipInductedFeed who={who} />;
}
