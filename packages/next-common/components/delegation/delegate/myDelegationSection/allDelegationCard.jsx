import {
  Democracy,
  Referenda,
  useModuleTab,
} from "next-common/components/profile/votingHistory/common";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import AllBeenDelegated from "next-common/components/summary/allDelegation/allBeenDelegated";
import AllMyDelegation from "next-common/components/summary/allDelegation/allMyDelegation";
import { myReferendaDelegationsSelector } from "next-common/store/reducers/myOnChainData/referenda/myReferendaDelegations";
import { useAllMyBeenDelegatedList } from "next-common/utils/hooks/referenda/useAllBeenDelegatedList";
import useFetchMyReferendaDelegations from "next-common/utils/hooks/referenda/useFetchMyReferendaDelegations";
import { useSelector } from "react-redux";
import Link from "next/link";
import { cn } from "next-common/utils";

export default function AllDelegationCard() {
  useFetchMyReferendaDelegations();
  const allReferendaDelegationsContent = useAllReferendaDelegationsContent();

  const moduleTab = useModuleTab();

  let content;
  if (moduleTab === Referenda) {
    content = allReferendaDelegationsContent;
  } else if (moduleTab === Democracy) {
    // eslint-disable-next-line no-empty-static-block
  }

  if (!content) {
    return null;
  }

  return (
    <SecondaryCard className="space-y-2">
      {content}
      <div
        className={cn(
          "flex justify-end pt-2 mt-4",
          "text14Medium text-theme500",
        )}
      >
        <Link href="/delegation/mine/received">Manage Delegation</Link>
      </div>
    </SecondaryCard>
  );
}

function useAllReferendaDelegationsContent() {
  const delegations = useSelector(myReferendaDelegationsSelector);
  const { beenDelegatedList } = useAllMyBeenDelegatedList();

  return (
    (!!delegations?.length || !!beenDelegatedList?.length) && (
      <>
        {!!delegations?.length && (
          <AllMyDelegation delegations={delegations} showDetailButton={false} />
        )}

        {!!beenDelegatedList?.length && (
          <AllBeenDelegated
            beenDelegatedList={beenDelegatedList}
            showDetailButton={false}
          />
        )}
      </>
    )
  );
}
