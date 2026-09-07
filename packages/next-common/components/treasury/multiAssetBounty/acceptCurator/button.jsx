import PrimaryButton from "next-common/lib/button/primary";
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

  // The proposed curator address read from the on-chain bounty storage
  // (undefined while the storage query above is still in flight).
  const curator = bounty?.status?.value?.curator;

  // Whether the current user may accept depends on the on-chain curator
  // structure (is the curator a multisig, is it behind a proxy delegate that
  // is a multisig, etc.) combined with the current user's role.
  const { loading: isRoleLoading, role } = useAccountRole(curator);
  const { showPopupFn, component } = useAcceptCuratorPopup(
    bountyIndex,
    curator,
    role,
  );

  // accept_curator requires the bounty to be in `Funded` state.
  if (bounty?.status?.type !== "Funded") {
    return null;
  }

  // Show the button to the curator itself, and to every signatory of the
  // multisig that ultimately controls the curator. role stays null while
  // the curator authority structure is being resolved.
  if (!curator || isRoleLoading || !role) {
    return null;
  }

  return (
    <>
      <PrimaryButton className="w-full" onClick={() => showPopupFn()}>
        Accept Curator
      </PrimaryButton>

      {component}
    </>
  );
}
