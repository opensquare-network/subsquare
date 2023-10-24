import AdvisoryCommitteeSubscription from "components/settings/subscription/advisoryCommitteeSubscription";
import OpenGovSubscription from "components/settings/subscription/openGovSubscription";
import TreasurySubscription from "components/settings/subscription/treasurySubscription";
import DemocracySubscription from "components/settings/subscription/democracySubscription";
import CouncilSubscription from "components/settings/subscription/councilSubscription";
import TechCommSubscription from "components/settings/subscription/techCommSubscription";

export default function OnChainEventsSubscription() {
  return (
    <>
      <OpenGovSubscription />
      <DemocracySubscription />
      <CouncilSubscription />
      <TreasurySubscription />
      <AdvisoryCommitteeSubscription />
      <TechCommSubscription />
    </>
  );
}
