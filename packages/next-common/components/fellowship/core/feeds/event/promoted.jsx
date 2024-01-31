import AddressUser from "next-common/components/user/addressUser";
import {
  FellowshipCoreFeedEventLabel,
  FellowshipCoreFeedRankLabel,
  getRowKey,
} from "./shared";

export default function FellowshipCoreFeedsPromotedEvent({ feed }) {
  const { indexer } = feed || {};
  return (
    <>
      <AddressUser key={getRowKey(indexer)} add={feed?.args?.who} noTooltip />
      <span>
        was{" "}
        <FellowshipCoreFeedEventLabel>Promoted</FellowshipCoreFeedEventLabel> to{" "}
        <FellowshipCoreFeedRankLabel rank={feed?.args?.toRank} />
      </span>
    </>
  );
}
