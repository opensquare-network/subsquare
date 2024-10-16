import ChildBountyClaim from "next-common/components/treasury/childBounty/claim";
import Meta from "next-common/components/treasury/childBounty/metadata";
import { RightBarWrapper } from "next-common/components/layout/sidebar/rightBarWrapper";
import { useOnchainData, usePostState } from "next-common/context/post";
import ChildBountySidebarBalance from "next-common/components/treasury/childBounty/balance";
import ProposeCurator from "next-common/components/treasury/childBounty/proposeCurator";
import BountyAcceptCuratorButton from "next-common/components/treasury/bounty/acceptCurator/button";
import useSubStorage from "next-common/hooks/common/useSubStorage";
import BountySidebarActionTip from "next-common/components/treasury/common/bountySidebarActionTip";

export default function ChildBountySidebar() {
  const state = usePostState();
  const isClaimable = ["PendingPayout", "Claimed"].includes(state);
  const { parentBountyId, index: childBountyId } = useOnchainData();
  const { result } = useSubStorage("childBounties", "childBounties", [
    parentBountyId,
    childBountyId,
  ]);

  const { status } = (result?.isSome && result?.unwrap?.()) || {};

  const showActionTip =
    status?.isCuratorProposed || status?.isPendingPayout || status?.isAdded;

  return (
    <RightBarWrapper>
      <ChildBountySidebarBalance />
      <ProposeCurator />
      <BountyAcceptCuratorButton
        pallet="childBounties"
        params={[parentBountyId, childBountyId]}
      />
      {isClaimable && (
        <>
          <Meta />
          <ChildBountyClaim />
        </>
      )}
      {showActionTip && <BountySidebarActionTip className="!mt-4" />}
    </RightBarWrapper>
  );
}
