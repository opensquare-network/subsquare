import { RightBarWrapper } from "next-common/components/layout/sidebar/rightBarWrapper";
import { useOnchainData } from "next-common/context/post";
import BountySidebarBalance from "next-common/components/treasury/bounty/balance";
import BountySidebarCurator from "next-common/components/treasury/bounty/curator";
import BountyClaim from "next-common/components/treasury/bounty/claim";
import NewChildBountyButton from "next-common/components/treasury/bounty/newChildBountyButton";
import BountyProposeCuratorButton from "next-common/components/treasury/bounty/proposeCurator/button";
import BountyAcceptCuratorButton from "next-common/components/treasury/bounty/acceptCurator/button";
import useSubStorage from "next-common/hooks/common/useSubStorage";
import BountySidebarActionTip from "next-common/components/treasury/common/bountySidebarActionTip";

function BountySidebar() {
  const { address, bountyIndex } = useOnchainData();
  const { result } = useSubStorage("bounties", "bounties", [bountyIndex]);

  if (!address) {
    return null;
  }

  const { status } = (result?.isSome && result?.unwrap?.()) || {};

  const showActionTip =
    status?.isCuratorProposed || status?.isPendingPayout || status?.isActive;

  return (
    <RightBarWrapper>
      <BountySidebarBalance />
      <BountyProposeCuratorButton />
      <BountyAcceptCuratorButton params={[bountyIndex]} />
      <BountyClaim />
      <BountySidebarCurator />
      <NewChildBountyButton />
      {showActionTip && <BountySidebarActionTip className="!mt-4" />}
    </RightBarWrapper>
  );
}

export default BountySidebar;
