import AddressUser from "next-common/components/user/addressUser";
import {
  FellowshipCoreFeedEventLabel,
  FellowshipCoreFeedRankLabel,
} from "./shared";

export default function FellowshipCoreFeedsDemotedEvent({ feed }) {
  const { args: { who, toRank } = {} } = feed || {};

  return (
    <>
      <AddressUser key={who} add={who} noTooltip />
      <span>
        was <FellowshipCoreFeedEventLabel>Demoted</FellowshipCoreFeedEventLabel>{" "}
        to
      </span>
      <FellowshipCoreFeedRankLabel rank={toRank} />
    </>
  );
}
