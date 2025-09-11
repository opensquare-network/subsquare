import AddressUser from "next-common/components/user/addressUser";
import {
  FellowshipCoreFeedEventLabel,
  FellowshipCoreFeedRankLabel,
} from "./shared";

export default function FellowshipCoreFeedsProvenEvent({
  feed,
  showUserInfo = true,
}) {
  const { args: { who, atRank } = {} } = feed || {};

  return (
    <>
      {showUserInfo && <AddressUser key={who} add={who} noTooltip />}
      <span>
        was <FellowshipCoreFeedEventLabel>Proved</FellowshipCoreFeedEventLabel>{" "}
        at
      </span>
      <FellowshipCoreFeedRankLabel rank={atRank} />
    </>
  );
}
