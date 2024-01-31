import AddressUser from "next-common/components/user/addressUser";
import { FellowshipCoreFeedEventLabel } from "./shared";

export default function FellowshipCoreFeedsActiveEvent({ feed }) {
  const { args: { who, isActive } = {} } = feed || {};
  return (
    <>
      <AddressUser key={who} add={who} noTooltip />
      <span>
        <FellowshipCoreFeedEventLabel>Changed</FellowshipCoreFeedEventLabel>{" "}
        status to{" "}
        <FellowshipCoreFeedEventLabel>
          {isActive ? "Active" : "Inactive"}
        </FellowshipCoreFeedEventLabel>
      </span>
    </>
  );
}
