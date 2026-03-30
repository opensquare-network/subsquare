import OpenGovDelegationSummary from "./openGovDelegationSummary";
import OpenGovDelegationList from "./openGovDelegationList";
import {
  Democracy,
  Referenda,
  useModuleTab,
} from "next-common/components/profile/votingHistory/common";
import DemocracyDelegation from "./democracyDelegation";
import useFetchMyReferendaDelegationsWithPapi from "next-common/utils/hooks/referenda/useFetchMyReferendaDelegationsWithPapi";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import DemocracyDelegatedVotes from "next-common/components/profile/delegation/delegatedVotes/democracyDelegatedVotes";
import { TabContentWrapper } from "next-common/components/profile/delegation/common/styled";
import useSubDemocracyDelegatingWithPapi from "next-common/utils/hooks/referenda/useSubDemocracyDelegatingWithPapi";

function OpenGovDelegated() {
  useFetchMyReferendaDelegationsWithPapi();

  return (
    <TabContentWrapper>
      <OpenGovDelegationSummary />
      <OpenGovDelegationList />
    </TabContentWrapper>
  );
}

function DemocracyDelegated() {
  const address = useRealAddress();
  const { delegating, isLoading } = useSubDemocracyDelegatingWithPapi(address);

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
