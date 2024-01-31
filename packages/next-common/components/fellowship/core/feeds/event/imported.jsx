import AddressUser from "next-common/components/user/addressUser";
import {
  FellowshipCoreFeedEventLabel,
  FellowshipCoreFeedRankLabel,
} from "./shared";

export default function FellowshipCoreFeedsImportedEvent({ feed }) {
  return (
    <>
      <AddressUser key={feed?.args?.who} add={feed?.args?.who} noTooltip />
      <span>
        was{" "}
        <FellowshipCoreFeedEventLabel>Imported</FellowshipCoreFeedEventLabel>{" "}
        with <FellowshipCoreFeedRankLabel rank={feed?.args?.rank} />
      </span>
    </>
  );
}
