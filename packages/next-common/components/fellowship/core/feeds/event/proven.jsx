import AddressUser from "next-common/components/user/addressUser";
import {
  FellowshipCoreFeedEventLabel,
  FellowshipCoreFeedRankLabel,
} from "./shared";

export default function FellowshipCoreFeedsProvenEvent({ feed }) {
  const { args: { who, atRank } = {} } = feed || {};

  return (
    <>
      <AddressUser key={who} add={who} noTooltip />
      <span>
        was <FellowshipCoreFeedEventLabel>Proved</FellowshipCoreFeedEventLabel>{" "}
        at
      </span>
      <FellowshipCoreFeedRankLabel rank={atRank} />
    </>
  );
}
