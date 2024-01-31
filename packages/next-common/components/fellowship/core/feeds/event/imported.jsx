import AddressUser from "next-common/components/user/addressUser";
import {
  FellowshipCoreFeedEventLabel,
  FellowshipCoreFeedRankLabel,
} from "./shared";

export default function FellowshipCoreFeedsImportedEvent({ feed }) {
  const { args: { who, rank } = {} } = feed || {};

  return (
    <>
      <AddressUser key={who} add={who} noTooltip />
      <span>
        was{" "}
        <FellowshipCoreFeedEventLabel>Imported</FellowshipCoreFeedEventLabel>{" "}
        with <FellowshipCoreFeedRankLabel rank={rank} />
      </span>
    </>
  );
}
