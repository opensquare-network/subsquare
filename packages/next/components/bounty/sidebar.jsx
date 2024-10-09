import { RightBarWrapper } from "next-common/components/layout/sidebar/rightBarWrapper";
import { useOnchainData } from "next-common/context/post";
import BountySidebarBalance from "next-common/components/treasury/bounty/balance";
import BountySidebarCurator from "next-common/components/treasury/bounty/curator";
import BountyClaim from "next-common/components/treasury/bounty/claim";
import NewChildBountyButton from "next-common/components/treasury/bounty/newChildBountyButton";
import BountyAcceptCurator from "next-common/components/treasury/bounty/acceptCurator";
import useSubStorage from "next-common/hooks/common/useSubStorage";
import BountySidebarActionTip from "next-common/components/treasury/common/bountySidebarActionTip";

function BountySidebar() {
  const { address, bountyIndex } = useOnchainData();
  const { result } = useSubStorage("bounties", "bounties", [bountyIndex]);

  if (!address) {
    return null;
  }

  const { status } = result?.unwrap?.() || {};

  const showActionTip =
    status?.isCuratorProposed || status?.isPendingPayout || status?.isActive;

  return (
    <RightBarWrapper>
      <BountySidebarBalance />
      <BountyAcceptCurator />
      <BountyClaim />
      <BountySidebarCurator />
      <NewChildBountyButton />
      {showActionTip && <BountySidebarActionTip />}
    </RightBarWrapper>
  );
}

export default BountySidebar;
