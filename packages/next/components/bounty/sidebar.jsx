import { RightBarWrapper } from "next-common/components/layout/sidebar/rightBarWrapper";
import { useOnchainData } from "next-common/context/post";
import BountySidebarBalance from "next-common/components/treasury/bounty/balance";
import BountySidebarCurator from "next-common/components/treasury/bounty/curator";
import BountyClaim from "next-common/components/treasury/bounty/claim";
import NewChildBountyButton from "next-common/components/treasury/bounty/newChildBountyButton";
import BountyAcceptCurator from "next-common/components/treasury/bounty/acceptCurator";
import useSubStorage from "next-common/hooks/common/useSubStorage";
import BountyCuratorActionHint from "next-common/components/treasury/common/curatorActionHint";

function BountySidebar() {
  const { address, bountyIndex } = useOnchainData();
  const { result } = useSubStorage("bounties", "bounties", [bountyIndex]);
  const { status } = result?.unwrap?.() || {};

  const showCuratorActionHint =
    status?.isCuratorProposed || status?.isPendingPayout || status?.isActive;

  if (!address) {
    return null;
  }

  return (
    <RightBarWrapper>
      <BountySidebarBalance />
      <BountyAcceptCurator />
      <BountyClaim />
      <BountySidebarCurator />
      <NewChildBountyButton />
      {showCuratorActionHint && <BountyCuratorActionHint />}
    </RightBarWrapper>
  );
}

export default BountySidebar;
