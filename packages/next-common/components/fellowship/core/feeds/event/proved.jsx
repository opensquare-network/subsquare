import AddressUser from "next-common/components/user/addressUser";
import {
  FellowshipCoreFeedEventLabel,
  FellowshipCoreFeedRankLabel,
} from "./shared";

export default function FellowshipCoreFeedsProvedEvent({ feed }) {
  return (
    <>
      <AddressUser key={feed?.args?.who} add={feed?.args?.who} noTooltip />
      <span>
        was <FellowshipCoreFeedEventLabel>Proved</FellowshipCoreFeedEventLabel>{" "}
        at
      </span>
      <FellowshipCoreFeedRankLabel rank={feed?.args?.rank} />
    </>
  );
}
