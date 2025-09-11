import ChildBountyClaim, {
  ChildBountyClaimed,
} from "next-common/components/treasury/childBounty/claim";
import ChildBountyMeta from "next-common/components/treasury/childBounty/metadata";
import { RightBarWrapper } from "next-common/components/layout/sidebar/rightBarWrapper";
import { useOnchainData } from "next-common/context/post";
import ChildBountySidebarBalance from "next-common/components/treasury/childBounty/balance";
import ProposeCurator from "next-common/components/treasury/childBounty/proposeCurator";
import BountyAcceptCuratorButton from "next-common/components/treasury/bounty/acceptCurator/button";
import useSubStorage from "next-common/hooks/common/useSubStorage";
import BountySidebarActionTip from "next-common/components/treasury/common/bountySidebarActionTip";

function ChildBountySidebarActionTip() {
  const { parentBountyId, index: childBountyId } = useOnchainData();
  const { result } = useSubStorage("childBounties", "childBounties", [
    parentBountyId,
    childBountyId,
  ]);

  const { status } = (result?.isSome && result?.unwrap?.()) || {};
  const showActionTip =
    status?.isCuratorProposed || status?.isPendingPayout || status?.isAdded;
  return showActionTip ? <BountySidebarActionTip className="!mt-4" /> : null;
}

export default function ChildBountySidebar() {
  const { parentBountyId, index: childBountyId } = useOnchainData();
  return (
    <RightBarWrapper>
      <ChildBountySidebarBalance />
      <ProposeCurator />
      <BountyAcceptCuratorButton
        pallet="childBounties"
        params={[parentBountyId, childBountyId]}
      />
      <ChildBountyMeta />
      <ChildBountyClaimed />
      <ChildBountyClaim />
      <ChildBountySidebarActionTip />
    </RightBarWrapper>
  );
}
