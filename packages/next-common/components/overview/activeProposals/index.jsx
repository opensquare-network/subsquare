import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import ActiveCollectives from "./collectives";
import ActiveDemocracy from "./democracy";
import ActiveFellowship from "./fellowship";
import ActiveReferenda from "./referenda";
import ActiveTreasury from "./treasury";

export default function ActiveProposals() {
  return (
    <div>
      <TitleContainer className="mb-4">Active Proposals</TitleContainer>

      <div>
        <ActiveReferenda />
        <ActiveFellowship />
        <ActiveDemocracy />
        <ActiveTreasury />
        <ActiveCollectives />
      </div>
    </div>
  );
}
