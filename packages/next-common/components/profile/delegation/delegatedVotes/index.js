import OpenGovDelegationSummary from "./openGovDelegationSummary";
import OpenGovDelegationList from "./openGovDelegationList";
import { Democracy, Referenda, useModuleTab } from "../../votingHistory/common";
import useDemocracyDelegating from "next-common/utils/hooks/referenda/useDemocracyDelegating";
import DemocracyDelegatedVotes from "./democracyDelegatedVotes";
import DemocracyDelegation from "./democracyDelegation";
import useFetchProfileReferendaDelegations from "next-common/utils/hooks/referenda/useFetchProfileReferendaDelegations";
import { TabContentWrapper } from "../common/styled";
import { useContextApi } from "next-common/context/api";
import useProfileAddress from "../../useProfileAddress";

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
  const api = useContextApi();
  const address = useProfileAddress();
  const { delegating, isLoading } = useDemocracyDelegating(api, address);

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
