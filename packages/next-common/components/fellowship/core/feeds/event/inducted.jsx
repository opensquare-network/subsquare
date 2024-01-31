import AddressUser from "next-common/components/user/addressUser";
import { FellowshipCoreFeedEventLabel } from "./shared";

export default function FellowshipCoreFeedsInductedEvent({ feed }) {
  const { args: { who } = {} } = feed || {};

  return (
    <>
      <AddressUser key={who} add={who} noTooltip />
      <span>
        was{" "}
        <FellowshipCoreFeedEventLabel>Inducted</FellowshipCoreFeedEventLabel>
      </span>
    </>
  );
}
