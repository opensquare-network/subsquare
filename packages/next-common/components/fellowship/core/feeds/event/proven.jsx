import AddressUser from "next-common/components/user/addressUser";
import {
  FellowshipCoreFeedEventLabel,
  FellowshipCoreFeedRankLabel,
  getRowKey,
} from "./shared";

export default function FellowshipCoreFeedsProvenEvent({ feed }) {
  const { indexer } = feed || {};
  return (
    <>
      <AddressUser key={getRowKey(indexer)} add={feed?.args?.who} noTooltip />
      <span>
        was <FellowshipCoreFeedEventLabel>Proved</FellowshipCoreFeedEventLabel>{" "}
        at
      </span>
      <FellowshipCoreFeedRankLabel rank={feed?.args?.rank} />
    </>
  );
}
