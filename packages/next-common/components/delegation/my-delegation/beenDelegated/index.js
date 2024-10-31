import {
  Democracy,
  Referenda,
  useModuleTab,
} from "next-common/components/profile/votingHistory/common";
import useBeenDelegated from "next-common/hooks/useBeenDelegated";
import { useMaybeServerAllMyBeenDelegatedList } from "next-common/utils/hooks/referenda/useAllBeenDelegatedList";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { TabContentWrapper } from "next-common/components/profile/delegation/common/styled";
import ReferendaBeenDelegatedSummary from "next-common/components/profile/delegation/beenDelegated/referendaBeenDelegatedSummary";
import ReferendaBeenDelegated from "next-common/components/profile/delegation/beenDelegated/referendaBeenDelegated";
import DemocracyBeenDelegatedSummary from "next-common/components/profile/delegation/beenDelegated/democracyBeenDelegatedSummary";
import DemocracyDelegators from "next-common/components/profile/delegation/beenDelegated/democracyDelegators";

function OpenGovBeenDelegated() {
  const { beenDelegatedList, isLoading } =
    useMaybeServerAllMyBeenDelegatedList();

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
