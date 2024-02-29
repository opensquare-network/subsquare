import { Referenda, useModuleTab } from "../../votingHistory/common";
import useBeenDelegated from "next-common/hooks/useBeenDelegated";
import DemocracyBeenDelegatedSummary from "./democracyBeenDelegatedSummary";
import DemocracyDelegators from "./democracyDelegators";
import { useAllBeenDelegatedList } from "next-common/utils/hooks/referenda/useAllBeenDelegatedList";
import ReferendaBeenDelegatedSummary from "./referendaBeenDelegatedSummary";
import useProfileAddress from "../../useProfileAddress";
import ReferendaBeenDelegated from "./referendaBeenDelegated";

function OpenGovBeenDelegated() {
  const address = useProfileAddress();
  const { beenDelegatedList } = useAllBeenDelegatedList(address);

  return (
    <div className="flex flex-col gap-[18px]">
      <ReferendaBeenDelegatedSummary
        tracksCount={beenDelegatedList?.length || 0}
      />
      <ReferendaBeenDelegated beenDelegatedList={beenDelegatedList} />
    </div>
  );
}

function DemocracyBeenDelegated() {
  const address = useProfileAddress();
  const { delegations, beenDelegatedList } = useBeenDelegated(address);

  return (
    <div className="flex flex-col gap-[18px]">
      <DemocracyBeenDelegatedSummary
        delegations={delegations}
        addressesCount={beenDelegatedList?.length}
      />
      <DemocracyDelegators delegatorsList={beenDelegatedList} />
    </div>
  );
}

export default function BeenDelegated() {
  const moduleTab = useModuleTab();

  if (moduleTab === Referenda) {
    return <OpenGovBeenDelegated />;
  }

  return <DemocracyBeenDelegated />;
}
