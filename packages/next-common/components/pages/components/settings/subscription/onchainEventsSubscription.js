import AdvisoryCommitteeSubscription from "next-common/components/pages/components/settings/subscription/advisoryCommitteeSubscription";
import OpenGovSubscription from "next-common/components/pages/components/settings/subscription/openGovSubscription";
import TreasurySubscription from "next-common/components/pages/components/settings/subscription/treasurySubscription";
import DemocracySubscription from "next-common/components/pages/components/settings/subscription/democracySubscription";
import CouncilSubscription from "next-common/components/pages/components/settings/subscription/councilSubscription";
import TechCommSubscription from "next-common/components/pages/components/settings/subscription/techCommSubscription";

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
