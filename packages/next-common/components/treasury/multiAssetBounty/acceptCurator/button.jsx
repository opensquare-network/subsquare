import SplitRoleMenuButton from "next-common/components/splitRoleMenuButton";
import Tooltip from "next-common/components/tooltip";
import { useContextPapi } from "next-common/context/papi";
import Link from "next-common/components/link";
import { useOnchainData } from "next-common/context/post";
import { isNil } from "lodash-es";
import { useEffect, useState } from "react";
import useAccountRole from "next-common/hooks/accountAuthority/useAccountRole";
import { isSameAddress } from "next-common/utils/isSameAddress";
import usePendingAcceptCuratorMultisig from "./usePendingAcceptCuratorMultisig";
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
  // each a different route; the split button lets the user pick one. The
  // structure also exposes multisig routes the user is NOT a member of.
  const { loading: isRoleLoading, roles, structure } = useAccountRole(curator);
  const { showPopupFn, component } = useAcceptCuratorPopup(
    bountyIndex,
    curator,
  );

  // Whether an identical accept curator multisig is already in progress
  // on-chain (possibly initiated by others through a multisig the user is not
  // a member of), to warn the user against initiating a duplicate.
  const { pending: hasPendingAcceptCuratorMultisig, multisigAddresses } =
    usePendingAcceptCuratorMultisig(bountyIndex, curator, structure);

  // The pending operation may belong to a multisig the current user is a
  // signatory of (manageable from their own multisig list) or to another
  // group's multisig (not listed in the user's /account/multisigs).
  const canManagePendingMultisig = (multisigAddresses || []).some((address) =>
    (roles || []).some(
      (role) =>
        role?.kind === "multisig" &&
        isSameAddress(role?.multisig?.multisigAddress, address),
    ),
  );

  // accept_curator requires the bounty to be in `Funded` state.
  if (bounty?.status?.type !== "Funded") {
    return null;
  }

  // No curator proposed yet, nothing to accept.
  if (!curator) {
    return null;
  }

  let disabledTooltip = "";
  if (isRoleLoading) {
    disabledTooltip = "Loading curator roles";
  } else if (roles.length === 0) {
    disabledTooltip = "Only the curator can accept";
  }

  return (
    <div className="w-full">
      <Tooltip className="w-full" content={disabledTooltip}>
        <SplitRoleMenuButton
          fullWidth
          action="Accept Curator"
          roles={roles}
          disabled={!!disabledTooltip}
          onClick={(role) => showPopupFn(role)}
        />
      </Tooltip>

      {hasPendingAcceptCuratorMultisig &&
        !disabledTooltip &&
        (canManagePendingMultisig ? (
          <div className="text-textSecondary text14Medium mt-2">
            An accept curator multisig has already been created.{" "}
            <Link className="underline" href="/account/multisigs">
              Manage it here
            </Link>
          </div>
        ) : (
          <div className="text-textSecondary text14Medium mt-2">
            An accept curator multisig has already been created by another
            group.
          </div>
        ))}

      {component}
    </div>
  );
}
