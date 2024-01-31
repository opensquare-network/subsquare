import AddressUser from "next-common/components/user/addressUser";
import {
  FellowshipCoreFeedEventLabel,
  FellowshipCoreFeedRankLabel,
  getRowKey,
} from "./shared";

export default function FellowshipCoreFeedsDemotedEvent({ feed }) {
  const { indexer } = feed || {};

  return (
    <>
      <AddressUser key={getRowKey(indexer)} add={feed?.args?.who} noTooltip />
      <span>
        was <FellowshipCoreFeedEventLabel>Demoted</FellowshipCoreFeedEventLabel>{" "}
        to
      </span>
      <FellowshipCoreFeedRankLabel rank={feed?.args?.rank} />
    </>
  );
}
