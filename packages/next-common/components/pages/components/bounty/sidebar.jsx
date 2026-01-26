import { RightBarWrapper } from "next-common/components/layout/sidebar/rightBarWrapper";
import { useOnchainData } from "next-common/context/post";
import BountySidebarBalance from "next-common/components/treasury/bounty/balance";
import BountySidebarCurator from "next-common/components/treasury/bounty/curator";
import BountyClaim from "next-common/components/treasury/bounty/claim";
import NewChildBountyButton from "next-common/components/treasury/bounty/newChildBountyButton";
import BountyProposeCuratorButton from "next-common/components/treasury/bounty/proposeCurator/button";
import BountyAcceptCuratorButton from "next-common/components/treasury/bounty/acceptCurator/button";
import BountySidebarActionTip from "next-common/components/treasury/common/bountySidebarActionTip";
import { has } from "lodash-es";

function BountySidebar() {
  const { address, bountyIndex, meta } = useOnchainData();
  const status = meta?.status || {};
  if (!address) {
    return null;
  }

  const showActionTip = ["curatorProposed", "pendingPayout", "active"].find(item => has(status, item));

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
