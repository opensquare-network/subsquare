import AddressUser from "next-common/components/user/addressUser";
import {
  FellowshipCoreFeedEventLabel,
  getRowKey,
} from "next-common/components/fellowship/core/feeds/event/shared";

export default function FellowshipCoreFeedsOffboardedEvent({ feed }) {
  const { indexer } = feed || {};

  return (
    <>
      <AddressUser key={getRowKey(indexer)} add={feed?.args?.who} noTooltip />
      <span>
        was{" "}
        <FellowshipCoreFeedEventLabel>Offboarded</FellowshipCoreFeedEventLabel>
      </span>
    </>
  );
}
