import AddressUser from "next-common/components/user/addressUser";
import { FellowshipCoreFeedEventLabel } from "next-common/components/fellowship/core/feeds/event/shared";

export default function FellowshipCoreFeedsOffboardedEvent({ feed }) {
  const { args: { who } = {} } = feed || {};

  return (
    <>
      <AddressUser key={who} add={who} noTooltip />
      <span>
        was{" "}
        <FellowshipCoreFeedEventLabel>Offboarded</FellowshipCoreFeedEventLabel>
      </span>
    </>
  );
}
