import useFetchMyReferendaDelegations from "next-common/utils/hooks/referenda/useFetchMyReferendaDelegations";
import TracksSummary from "../common/tracksSummary";
import MyDelegation from "./myDelegation";
import { Referenda, useModuleTab } from "../../votingHistory/common";

function OpenGovDelegatedVotes() {
  useFetchMyReferendaDelegations();

  return (
    <div className="flex flex-col gap-[18px]">
      <TracksSummary />
      <MyDelegation />
    </div>
  );
}

function DemocracyDelegatedVotes() {
  return null;
}

export default function DelegatedVotes() {
  const moduleTab = useModuleTab();

  if (moduleTab === Referenda) {
    return <OpenGovDelegatedVotes />;
  }

  return <DemocracyDelegatedVotes />;
}
