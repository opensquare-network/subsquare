import AddressUser from "next-common/components/user/addressUser";
import { FellowshipCoreFeedEventLabel } from "./shared";

export default function FellowshipCoreFeedsInductedEvent({ feed }) {
  return (
    <>
      <AddressUser key={feed?.args?.who} add={feed?.args?.who} noTooltip />
      <span>
        was{" "}
        <FellowshipCoreFeedEventLabel>Inducted</FellowshipCoreFeedEventLabel>
      </span>
    </>
  );
}
