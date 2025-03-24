import AddressUser from "next-common/components/user/addressUser";
import {
  FellowshipCoreFeedEventLabel,
  FellowshipCoreFeedRankLabel,
} from "./shared";

export default function FellowshipCoreFeedsImportedEvent({
  feed,
  showUserInfo = true,
}) {
  const { args: { who, rank } = {} } = feed || {};

  return (
    <>
      {showUserInfo && <AddressUser key={who} add={who} noTooltip />}
      <span>
        was{" "}
        <FellowshipCoreFeedEventLabel>Imported</FellowshipCoreFeedEventLabel>{" "}
        with <FellowshipCoreFeedRankLabel rank={rank} />
      </span>
    </>
  );
}
