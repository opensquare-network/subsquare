import AddressUser from "next-common/components/user/addressUser";
import ExternalLink from "next-common/components/externalLink";
import {
  FellowshipCoreFeedEventLabel,
  getRowKey,
} from "next-common/components/fellowship/core/feeds/event/shared";

export default function FellowshipCoreFeedsRequestedEvent({ feed }) {
  const { args: { who, wish } = {}, indexer } = feed || {};

  return (
    <>
      <AddressUser key={getRowKey(indexer)} add={who} noTooltip />

      <span>
        submitted{" "}
        <ExternalLink
          href=""
          className="text-inherit hover:text-textSecondary !underline"
          externalIcon={false}
        >
          evidence
        </ExternalLink>{" "}
        with wish{" "}
      </span>

      <FellowshipCoreFeedEventLabel>{wish}</FellowshipCoreFeedEventLabel>
    </>
  );
}
