import { FellowshipFeedEventLabel } from "next-common/components/fellowship/feeds/label";

export default function FellowshipCycleStartedFeed({ index }) {
  return (
    <span>
      <FellowshipFeedEventLabel>Cycle #{index}</FellowshipFeedEventLabel>
      &nbsp;started
    </span>
  );
}
