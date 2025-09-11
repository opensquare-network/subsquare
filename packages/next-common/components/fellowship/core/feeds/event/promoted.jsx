import AddressUser from "next-common/components/user/addressUser";
import {
  FellowshipCoreFeedEventLabel,
  FellowshipCoreFeedRankLabel,
} from "./shared";

export default function FellowshipCoreFeedsPromotedEvent({
  feed,
  showUserInfo = true,
}) {
  const { args: { who, toRank } = {} } = feed || {};

  return (
    <>
      {showUserInfo && <AddressUser key={who} add={who} noTooltip />}
      <span>
        was{" "}
        <FellowshipCoreFeedEventLabel>Promoted</FellowshipCoreFeedEventLabel> to{" "}
        <FellowshipCoreFeedRankLabel rank={toRank} />
      </span>
    </>
  );
}
