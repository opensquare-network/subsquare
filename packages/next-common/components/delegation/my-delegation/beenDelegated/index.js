import {
  Democracy,
  Referenda,
  useModuleTab,
} from "next-common/components/profile/votingHistory/common";
import useBeenDelegated from "next-common/hooks/useBeenDelegated";
import DemocracyBeenDelegatedSummary from "./democracyBeenDelegatedSummary";
import DemocracyDelegators from "./democracyDelegators";
import { useAllMyBeenDelegatedList } from "next-common/utils/hooks/referenda/useAllBeenDelegatedList";
import ReferendaBeenDelegatedSummary from "./referendaBeenDelegatedSummary";
import ReferendaBeenDelegated from "./referendaBeenDelegated";
import { TabContentWrapper } from "../common/styled";
import useRealAddress from "next-common/utils/hooks/useRealAddress";

function OpenGovBeenDelegated() {
  const { beenDelegatedList, isLoading } = useAllMyBeenDelegatedList();

  return (
    <TabContentWrapper>
      <ReferendaBeenDelegatedSummary
        beenDelegatedList={beenDelegatedList}
        isLoading={isLoading}
      />
      <ReferendaBeenDelegated
        beenDelegatedList={beenDelegatedList}
        isLoading={isLoading}
      />
    </TabContentWrapper>
  );
}

function DemocracyBeenDelegated() {
  const address = useRealAddress();
  const { delegations, beenDelegatedList, isLoading } =
    useBeenDelegated(address);

  return (
    <TabContentWrapper>
      <DemocracyBeenDelegatedSummary
        delegations={delegations}
        addressesCount={beenDelegatedList?.length}
        isLoading={isLoading}
      />
      <DemocracyDelegators
        delegatorsList={beenDelegatedList}
        isLoading={isLoading}
      />
    </TabContentWrapper>
  );
}

export default function BeenDelegated() {
  const moduleTab = useModuleTab();

  if (moduleTab === Referenda) {
    return <OpenGovBeenDelegated />;
  } else if (moduleTab === Democracy) {
    return <DemocracyBeenDelegated />;
  } else {
    return null;
  }
}
