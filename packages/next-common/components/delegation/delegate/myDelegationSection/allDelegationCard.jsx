import {
  Democracy,
  Referenda,
  useModuleTab,
} from "next-common/components/profile/votingHistory/common";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import AllBeenDelegatedInfo from "next-common/components/summary/allDelegation/allBeenDelegatedInfo";
import AllMyDelegationInfo from "next-common/components/summary/allDelegation/allMyDelegationInfo";
import { myReferendaDelegationsSelector } from "next-common/store/reducers/myOnChainData/referenda/myReferendaDelegations";
import Link from "next-common/components/link";
import { cn } from "next-common/utils";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import useSubDemocracyDelegatingWithPapi from "next-common/utils/hooks/referenda/useSubDemocracyDelegatingWithPapi";
import useBeenDelegatedWithPapi from "next-common/hooks/useBeenDelegatedWithPapi";
import BeenDelegatedInfo from "next-common/components/summary/democracyBeenDelegated/beenDelegatedInfo";
import { DemocracySummaryDelegationInfoWithPapi } from "next-common/components/summary/democracySummaryDelegation/democracySummaryDelegationInfo";
import { useSelector } from "react-redux";
import { useAllMyBeenDelegatedList } from "next-common/utils/hooks/referenda/useAllBeenDelegatedList";
import useFetchMyReferendaDelegations from "next-common/utils/hooks/referenda/useFetchMyReferendaDelegations";

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

function AllDelegationContainer({ children, linkToMyDelegations }) {
  return (
    <SecondaryCard className="space-y-2">
      {children}
      <div
        className={cn(
          "flex justify-end pt-2 mt-4",
          "text14Medium text-theme500",
        )}
      >
        <Link
          href={
            linkToMyDelegations
              ? "/delegation/mine/delegations"
              : "/delegation/mine/received"
          }
        >
          Detail
        </Link>
      </div>
    </SecondaryCard>
  );
}

function AllReferendaDelegationsContent() {
  useFetchMyReferendaDelegations();
  const delegations = useSelector(myReferendaDelegationsSelector);
  const { beenDelegatedList } = useAllMyBeenDelegatedList();

  const hasDelegations = !!delegations?.length;
  const hasBeenDelegated = !!beenDelegatedList?.length;

  if (!hasDelegations && !hasBeenDelegated) {
    return null;
  }

  return (
    <AllDelegationContainer linkToMyDelegations={hasDelegations}>
      {hasDelegations && <AllMyDelegationInfo delegations={delegations} />}

      {hasBeenDelegated && (
        <AllBeenDelegatedInfo beenDelegatedList={beenDelegatedList} />
      )}
    </AllDelegationContainer>
  );
}

function AllDemocracyDelegationsContent() {
  const realAddress = useRealAddress();
  const { delegating } = useSubDemocracyDelegatingWithPapi(realAddress);
  const { delegations, beenDelegatedList } =
    useBeenDelegatedWithPapi(realAddress);

  const hasDelegating = !!delegating;
  const hasBeenDelegated = !!beenDelegatedList?.length;

  if (!hasDelegating && !hasBeenDelegated) {
    return null;
  }

  return (
    <AllDelegationContainer linkToMyDelegations={hasDelegating}>
      {hasDelegating && (
        <DemocracySummaryDelegationInfoWithPapi delegating={delegating} />
      )}

      {hasBeenDelegated && (
        <BeenDelegatedInfo
          delegations={delegations}
          addressesCount={beenDelegatedList?.length}
        />
      )}
    </AllDelegationContainer>
  );
}
