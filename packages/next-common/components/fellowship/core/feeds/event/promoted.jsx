import AddressUser from "next-common/components/user/addressUser";
import {
  FellowshipCoreFeedEventLabel,
  FellowshipCoreFeedRankLabel,
} from "./shared";

export default function FellowshipCoreFeedsPromotedEvent({ feed }) {
  const { args: { who, toRank } = {} } = feed || {};

  return (
    <>
      <AddressUser key={who} add={who} noTooltip />
      <span>
        was{" "}
        <FellowshipCoreFeedEventLabel>Promoted</FellowshipCoreFeedEventLabel> to{" "}
        <FellowshipCoreFeedRankLabel rank={toRank} />
      </span>
    </>
  );
}
