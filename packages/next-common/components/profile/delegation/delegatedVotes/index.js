import TracksSummary from "./tracksSummary";
import TracksDelegation from "./tracksDelegation";
import { Democracy, Referenda, useModuleTab } from "../../votingHistory/common";
import useDemocracyDelegating from "next-common/utils/hooks/referenda/useDemocracyDelegating";
import DemocracyDelegatedVotes from "./democracyDelegatedVotes";
import DemocracyDelegation from "./democracyDelegation";
import useFetchReferendaDelegations from "next-common/utils/hooks/referenda/useFetchReferendaDelegations";
import useProfileAddress from "../../useProfileAddress";
import { TabContentWrapper } from "../common/styled";
import { useContextApi } from "next-common/context/api";

function OpenGovDelegated() {
  const address = useProfileAddress();
  useFetchReferendaDelegations(address);

  return (
    <TabContentWrapper>
      <TracksSummary />
      <TracksDelegation />
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
