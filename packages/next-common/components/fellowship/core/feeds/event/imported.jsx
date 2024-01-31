import AddressUser from "next-common/components/user/addressUser";
import {
  FellowshipCoreFeedEventLabel,
  FellowshipCoreFeedRankLabel,
  getRowKey,
} from "./shared";

export default function FellowshipCoreFeedsImportedEvent({ feed }) {
  const { indexer } = feed || {};

  return (
    <>
      <AddressUser key={getRowKey(indexer)} add={feed?.args?.who} noTooltip />
      <span>
        was{" "}
        <FellowshipCoreFeedEventLabel>Imported</FellowshipCoreFeedEventLabel>{" "}
        with <FellowshipCoreFeedRankLabel rank={feed?.args?.rank} />
      </span>
    </>
  );
}
