import AddressUser from "next-common/components/user/addressUser";
import {
  FellowshipCoreFeedEventLabel,
  FellowshipCoreFeedRankLabel,
} from "./shared";

export default function FellowshipCoreFeedsRetainedEvent({ feed }) {
  return (
    <>
      <AddressUser key={feed?.args?.who} add={feed?.args?.who} noTooltip />
      <span>
        submitted evidence to{" "}
        <FellowshipCoreFeedEventLabel>Retained</FellowshipCoreFeedEventLabel> at{" "}
        <FellowshipCoreFeedRankLabel rank={feed?.args?.rank} />
      </span>
    </>
  );
}
