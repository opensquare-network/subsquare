import { FellowshipFeedEventLabel } from "next-common/components/fellowship/feeds/label";

export default function FellowshipCycleEndedFeed({ index }) {
  return (
    <span>
      <FellowshipFeedEventLabel>Cycle #{index}</FellowshipFeedEventLabel>
      &nbsp;ended
    </span>
  );
}
