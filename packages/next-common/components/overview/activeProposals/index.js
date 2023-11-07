import ActiveCollectives from "./collectives";
import ActiveDemocracy from "./democracy";
import ActiveFellowship from "./fellowship";
import ActiveReferenda from "./referenda";
import ActiveTreasury from "./treasury";

export default function ActiveProposals() {
  return (
    <>
      <ActiveReferenda />
      <ActiveFellowship />
      <ActiveDemocracy />
      <ActiveTreasury />
      <ActiveCollectives />
    </>
  );
}
