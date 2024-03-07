import OpenGovDelegationSummary from "./openGovDelegationSummary";
import OpenGovDelegationList from "./openGovDelegationList";
import {
  Democracy,
  Referenda,
  useModuleTab,
} from "next-common/components/profile/votingHistory/common";
import useDemocracyDelegating from "next-common/utils/hooks/referenda/useDemocracyDelegating";
import DemocracyDelegatedVotes from "./democracyDelegatedVotes";
import DemocracyDelegation from "./democracyDelegation";
import { TabContentWrapper } from "../common/styled";
import { useContextApi } from "next-common/context/api";
import useFetchMyReferendaDelegations from "next-common/utils/hooks/referenda/useFetchMyReferendaDelegations";
import useRealAddress from "next-common/utils/hooks/useRealAddress";

function OpenGovDelegated() {
  useFetchMyReferendaDelegations();

  return (
    <TabContentWrapper>
      <OpenGovDelegationSummary />
      <OpenGovDelegationList />
    </TabContentWrapper>
  );
}

function DemocracyDelegated() {
  const api = useContextApi();
  const address = useRealAddress();
  const { delegating, refresh, isLoading } = useDemocracyDelegating(
    api,
    address,
  );

  return (
    <TabContentWrapper>
      <DemocracyDelegatedVotes delegating={delegating} isLoading={isLoading} />
      <DemocracyDelegation
        delegating={delegating}
        isLoading={isLoading}
        refresh={refresh}
      />
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
