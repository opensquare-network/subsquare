import AdvisoryCommitteeSubscription from "components/settings/subscription/advisoryCommitteeSubscription";
import OpenGovSubscription from "components/settings/subscription/openGovSubscription";
import TreasurySubscription from "components/settings/subscription/treasurySubscription";
import DemocracySubscription from "components/settings/subscription/democracySubscription";
import CouncilSubscription from "components/settings/subscription/councilSubscription";
import TechCommSubscription from "components/settings/subscription/techCommSubscription";
import { useUser } from "next-common/context/user";
import { usePageProps } from "next-common/context/page";

export default function OnChainEventsSubscription() {
  const loginUser = useUser();
  const { subscription } = usePageProps();

  const isVerifiedUser = loginUser?.emailVerified;
  const telegramLinked = loginUser?.telegram?.chat;
  const disabled = !isVerifiedUser && !telegramLinked;

  return (
    <>
      <TreasurySubscription subscription={subscription} disabled={disabled} />
      <CouncilSubscription subscription={subscription} disabled={disabled} />
      <TechCommSubscription subscription={subscription} disabled={disabled} />
      <DemocracySubscription subscription={subscription} disabled={disabled} />
      <OpenGovSubscription subscription={subscription} disabled={disabled} />
      <AdvisoryCommitteeSubscription
        subscription={subscription}
        disabled={disabled}
      />
    </>
  );
}
