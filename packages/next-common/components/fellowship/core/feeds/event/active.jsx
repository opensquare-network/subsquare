import AddressUser from "next-common/components/user/addressUser";
import { FellowshipCoreFeedEventLabel, getRowKey } from "./shared";

export default function FellowshipCoreFeedsActiveEvent({ feed }) {
  const { args: { who, isActive } = {}, indexer } = feed || {};
  return (
    <>
      <AddressUser key={getRowKey(indexer)} add={who} noTooltip />
      <span>
        <FellowshipCoreFeedEventLabel>Changed</FellowshipCoreFeedEventLabel>{" "}
        status to{" "}
        <FellowshipCoreFeedEventLabel>
          {isActive ? "Active" : "Inactive"}
        </FellowshipCoreFeedEventLabel>
      </span>
    </>
  );
}
