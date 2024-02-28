import useFetchMyReferendaDelegations from "next-common/utils/hooks/referenda/useFetchMyReferendaDelegations";
import TracksSummary from "./tracksSummary";
import MyTracksDelegation from "./myTracksDelegation";
import { Referenda, useModuleTab } from "../../votingHistory/common";
import useApi from "next-common/utils/hooks/useApi";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import useDemocracyDelegating from "next-common/utils/hooks/referenda/useDemocracyDelegating";
import DemocracyDelegatedVotes from "./democracyDelegatedVotes";
import MyDemocracyDelegation from "./myDemocracyDelegation";

function OpenGovDelegated() {
  useFetchMyReferendaDelegations();

  return (
    <div className="flex flex-col gap-[18px]">
      <TracksSummary />
      <MyTracksDelegation />
    </div>
  );
}

function DemocracyDelegated() {
  const api = useApi();
  const realAddress = useRealAddress();
  const { delegating } = useDemocracyDelegating(api, realAddress);

  return (
    <div className="flex flex-col gap-[18px]">
      <DemocracyDelegatedVotes delegating={delegating} />
      <MyDemocracyDelegation delegating={delegating} />
    </div>
  );
}

export default function DelegatedVotes() {
  const moduleTab = useModuleTab();

  if (moduleTab === Referenda) {
    return <OpenGovDelegated />;
  }

  return <DemocracyDelegated />;
}
