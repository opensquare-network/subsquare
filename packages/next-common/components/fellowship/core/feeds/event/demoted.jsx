import AddressUser from "next-common/components/user/addressUser";
import {
  FellowshipCoreFeedEventLabel,
  FellowshipCoreFeedRankLabel,
} from "./shared";

export default function FellowshipCoreFeedsDemotedEvent({ feed }) {
  return (
    <>
      <AddressUser key={feed?.args?.who} add={feed?.args?.who} noTooltip />
      <span>
        was <FellowshipCoreFeedEventLabel>Demoted</FellowshipCoreFeedEventLabel>{" "}
        to
      </span>
      <FellowshipCoreFeedRankLabel rank={feed?.args?.rank} />
    </>
  );
}
