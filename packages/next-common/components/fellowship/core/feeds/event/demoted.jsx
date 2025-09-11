import AddressUser from "next-common/components/user/addressUser";
import {
  FellowshipCoreFeedEventLabel,
  FellowshipCoreFeedRankLabel,
} from "./shared";

export default function FellowshipCoreFeedsDemotedEvent({
  feed,
  showUserInfo = true,
}) {
  const { args: { who, toRank } = {} } = feed || {};

  return (
    <>
      {showUserInfo && <AddressUser key={who} add={who} noTooltip />}
      <span>
        was <FellowshipCoreFeedEventLabel>Demoted</FellowshipCoreFeedEventLabel>{" "}
        to
      </span>
      <FellowshipCoreFeedRankLabel rank={toRank} />
    </>
  );
}
