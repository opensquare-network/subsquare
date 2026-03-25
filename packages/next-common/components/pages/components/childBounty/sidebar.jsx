import ChildBountyClaim, {
  ChildBountyClaimed,
} from "next-common/components/treasury/childBounty/claim";
import ChildBountyMeta from "next-common/components/treasury/childBounty/metadata";
import { RightBarWrapper } from "next-common/components/layout/sidebar/rightBarWrapper";
import { useOnchainData } from "next-common/context/post";
import ChildBountySidebarBalance from "next-common/components/treasury/childBounty/balance";
import ProposeCurator from "next-common/components/treasury/childBounty/proposeCurator";
import BountyAcceptCuratorButton from "next-common/components/treasury/bounty/acceptCurator/button";
import BountySidebarActionTip from "next-common/components/treasury/common/bountySidebarActionTip";
import { useContextPapiApi } from "next-common/context/papi";
import { useEffect, useState } from "react";

function ChildBountySidebarActionTip() {
  const { parentBountyId, index: childBountyId } = useOnchainData();
  const papi = useContextPapiApi();
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (!papi) {
      return;
    }
    papi.query.ChildBounties.ChildBounties.getValue(
      parentBountyId,
      childBountyId,
    ).then((result) => setResult(result));
  }, [papi, parentBountyId, childBountyId]);

  const { status } = result || {};
  const showActionTip = ["CuratorProposed", "PendingPayout", "Added"].includes(
    status?.type,
  );

  return showActionTip ? <BountySidebarActionTip className="!mt-4" /> : null;
}

export default function ChildBountySidebar() {
  const { parentBountyId, index: childBountyId } = useOnchainData();
  return (
    <RightBarWrapper>
      <ChildBountySidebarBalance />
      <ProposeCurator />
      <BountyAcceptCuratorButton
        pallet="ChildBounties"
        params={[parentBountyId, childBountyId]}
      />
      <ChildBountyMeta />
      <ChildBountyClaimed />
      <ChildBountyClaim />
      <ChildBountySidebarActionTip />
    </RightBarWrapper>
  );
}
