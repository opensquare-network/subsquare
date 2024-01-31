import AddressUser from "next-common/components/user/addressUser";
import {
  FellowshipCoreFeedEventLabel,
  FellowshipCoreFeedRankLabel,
} from "./shared";

export default function FellowshipCoreFeedsPromotedEvent({ feed }) {
  return (
    <>
      <AddressUser key={feed?.args?.who} add={feed?.args?.who} noTooltip />
      <span>
        was{" "}
        <FellowshipCoreFeedEventLabel>Promoted</FellowshipCoreFeedEventLabel> to{" "}
        <FellowshipCoreFeedRankLabel rank={feed?.args?.toRank} />
      </span>
    </>
  );
}
