import AddressUser from "next-common/components/user/addressUser";
import { FellowshipCoreFeedEventLabel } from "./shared";

export default function FellowshipCoreFeedsInactiveEvent({ feed }) {
  return (
    <>
      <AddressUser key={feed?.args?.who} add={feed?.args?.who} noTooltip />
      <span>
        <FellowshipCoreFeedEventLabel>Changed</FellowshipCoreFeedEventLabel>{" "}
        status to{" "}
        <FellowshipCoreFeedEventLabel>Inactive</FellowshipCoreFeedEventLabel>
      </span>
    </>
  );
}
