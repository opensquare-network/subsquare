import {
  Democracy,
  Referenda,
  useModuleTab,
} from "next-common/components/profile/votingHistory/common";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import AllBeenDelegatedInfo from "next-common/components/summary/allDelegation/allBeenDelegatedInfo";
import AllMyDelegationInfo from "next-common/components/summary/allDelegation/allMyDelegationInfo";
import { myReferendaDelegationsSelector } from "next-common/store/reducers/myOnChainData/referenda/myReferendaDelegations";
import { useAllMyBeenDelegatedList } from "next-common/utils/hooks/referenda/useAllBeenDelegatedList";
import useFetchMyReferendaDelegations from "next-common/utils/hooks/referenda/useFetchMyReferendaDelegations";
import { useSelector } from "react-redux";
import Link from "next/link";
import { cn } from "next-common/utils";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import useSubDemocracyDelegating from "next-common/utils/hooks/referenda/useSubDemocracyDelegating";
import useBeenDelegated from "next-common/hooks/useBeenDelegated";
import BeenDelegatedInfo from "next-common/components/summary/democracyBeenDelegated/beenDelegatedInfo";
import DemocracySummaryDelegationInfo from "next-common/components/summary/democracySummaryDelegation/democracySummaryDelegationInfo";

export default function AllDelegationCard() {
  const moduleTab = useModuleTab();

  let content;
  if (moduleTab === Referenda) {
    content = <AllReferendaDelegationsContent />;
  } else if (moduleTab === Democracy) {
    content = <AllDemocracyDelegationsContent />;
  }

  return content;
}

function AllDelegationContainer({ children }) {
  return (
    <SecondaryCard className="space-y-2">
      {children}
      <div
        className={cn(
          "flex justify-end pt-2 mt-4",
          "text14Medium text-theme500",
        )}
      >
        <Link href="/delegation/mine/received">Detail</Link>
      </div>
    </SecondaryCard>
  );
}

function AllReferendaDelegationsContent() {
  useFetchMyReferendaDelegations();
  const delegations = useSelector(myReferendaDelegationsSelector);
  const { beenDelegatedList } = useAllMyBeenDelegatedList();

  if (!delegations?.length && !beenDelegatedList?.length) {
    return null;
  }

  return (
    <AllDelegationContainer>
      {!!delegations?.length && (
        <AllMyDelegationInfo delegations={delegations} />
      )}

      {!!beenDelegatedList?.length && (
        <AllBeenDelegatedInfo beenDelegatedList={beenDelegatedList} />
      )}
    </AllDelegationContainer>
  );
}

function AllDemocracyDelegationsContent() {
  const realAddress = useRealAddress();
  const { delegating } = useSubDemocracyDelegating(realAddress);
  const { delegations, beenDelegatedList } = useBeenDelegated(realAddress);

  const showDelegating = !!delegating;
  const showBeenDelegated = !!beenDelegatedList?.length;

  if (!showDelegating && !showBeenDelegated) {
    return null;
  }

  return (
    <AllDelegationContainer>
      {showDelegating && (
        <DemocracySummaryDelegationInfo delegating={delegating} />
      )}

      {showBeenDelegated && (
        <BeenDelegatedInfo
          delegations={delegations}
          addressesCount={beenDelegatedList?.length}
        />
      )}
    </AllDelegationContainer>
  );
}
