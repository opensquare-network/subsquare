import TracksSummary from "./tracksSummary";
import TracksDelegation from "./tracksDelegation";
import { Referenda, useModuleTab } from "../../votingHistory/common";
import useApi from "next-common/utils/hooks/useApi";
import useDemocracyDelegating from "next-common/utils/hooks/referenda/useDemocracyDelegating";
import DemocracyDelegatedVotes from "./democracyDelegatedVotes";
import DemocracyDelegation from "./democracyDelegation";
import useFetchReferendaDelegations from "next-common/utils/hooks/referenda/useFetchReferendaDelegations";
import useProfileAddress from "../../useProfileAddress";

function OpenGovDelegated() {
  const address = useProfileAddress();
  useFetchReferendaDelegations(address);

  return (
    <div className="flex flex-col gap-[18px]">
      <TracksSummary />
      <TracksDelegation />
    </div>
  );
}

function DemocracyDelegated() {
  const api = useApi();
  const address = useProfileAddress();
  const { delegating } = useDemocracyDelegating(api, address);

  return (
    <div className="flex flex-col gap-[18px]">
      <DemocracyDelegatedVotes delegating={delegating} />
      <DemocracyDelegation delegating={delegating} />
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
