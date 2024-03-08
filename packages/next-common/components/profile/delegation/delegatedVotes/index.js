import OpenGovDelegationSummary from "./openGovDelegationSummary";
import OpenGovDelegationList from "./openGovDelegationList";
import { Democracy, Referenda, useModuleTab } from "../../votingHistory/common";
import DemocracyDelegatedVotes from "./democracyDelegatedVotes";
import DemocracyDelegation from "./democracyDelegation";
import useFetchProfileReferendaDelegations from "next-common/utils/hooks/referenda/useFetchProfileReferendaDelegations";
import { TabContentWrapper } from "../common/styled";
import useProfileAddress from "../../useProfileAddress";
import useSubDemocracyDelegating from "next-common/utils/hooks/referenda/useSubDemocracyDelegating";

function OpenGovDelegated() {
  const address = useProfileAddress();
  useFetchProfileReferendaDelegations(address);

  return (
    <TabContentWrapper>
      <OpenGovDelegationSummary />
      <OpenGovDelegationList />
    </TabContentWrapper>
  );
}

function DemocracyDelegated() {
  const address = useProfileAddress();
  const { delegating, isLoading } = useSubDemocracyDelegating(address);

  return (
    <TabContentWrapper>
      <DemocracyDelegatedVotes delegating={delegating} isLoading={isLoading} />
      <DemocracyDelegation delegating={delegating} isLoading={isLoading} />
    </TabContentWrapper>
  );
}

export default function DelegatedVotes() {
  const moduleTab = useModuleTab();

  if (moduleTab === Referenda) {
    return <OpenGovDelegated />;
  } else if (moduleTab === Democracy) {
    return <DemocracyDelegated />;
  } else {
    return null;
  }
}
