import SplitRoleMenuButton from "next-common/components/splitRoleMenuButton";
import { useContextPapi } from "next-common/context/papi";
import { useOnchainData } from "next-common/context/post";
import { isNil } from "lodash-es";
import { useEffect, useState } from "react";
import useAccountRole from "next-common/hooks/accountAuthority/useAccountRole";
import { useAcceptCuratorPopup } from "./useAcceptCuratorPopup";

export default function MultiAssetBountyAcceptCuratorButton() {
  const { bountyIndex } = useOnchainData();
  const { api: papi, checkPallet } = useContextPapi();
  const [bounty, setBounty] = useState(null);

  useEffect(() => {
    if (
      !papi ||
      !checkPallet("MultiAssetBounties", "Bounties") ||
      isNil(bountyIndex)
    ) {
      return;
    }

    papi.query.MultiAssetBounties.Bounties.getValue(bountyIndex).then((value) =>
      setBounty(value),
    );
  }, [papi, checkPallet, bountyIndex]);

  // Proposed curator address from the on-chain bounty storage.
  const curator = bounty?.status?.value?.curator;

  // A user may accept through several roles (e.g. several delegate multisigs),
  // each a different route; the split button lets the user pick one.
  const { loading: isRoleLoading, roles } = useAccountRole(curator);
  const { showPopupFn, component } = useAcceptCuratorPopup(
    bountyIndex,
    curator,
  );

  // accept_curator requires the bounty to be in `Funded` state.
  if (bounty?.status?.type !== "Funded") {
    return null;
  }

  // Show only while roles are resolved and the user can dispatch.
  if (!curator || isRoleLoading || roles.length === 0) {
    return null;
  }

  return (
    <>
      <SplitRoleMenuButton
        fullWidth
        action="Accept Curator"
        roles={roles}
        onClick={(role) => showPopupFn(role)}
      />

      {component}
    </>
  );
}
