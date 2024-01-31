import AddressUser from "next-common/components/user/addressUser";
import { FellowshipCoreFeedEventLabel, getRowKey } from "./shared";

export default function FellowshipCoreFeedsInductedEvent({ feed }) {
  const { indexer } = feed || {};

  return (
    <>
      <AddressUser key={getRowKey(indexer)} add={feed?.args?.who} noTooltip />
      <span>
        was{" "}
        <FellowshipCoreFeedEventLabel>Inducted</FellowshipCoreFeedEventLabel>
      </span>
    </>
  );
}
