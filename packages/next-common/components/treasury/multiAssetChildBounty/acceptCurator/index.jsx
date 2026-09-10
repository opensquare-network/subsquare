import SplitRoleMenuButton from "next-common/components/splitRoleMenuButton";
import useAccountRole from "next-common/hooks/accountAuthority/useAccountRole";
import Tooltip from "next-common/components/tooltip";
import Link from "next-common/components/link";
import { useOnchainData } from "next-common/context/post";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { isSameAddress } from "next-common/utils/isSameAddress";
import useMultiAssetChildBountyStatus from "../useMultiAssetChildBountyStatus";
import usePendingAcceptCuratorMultisig from "./usePendingAcceptCuratorMultisig";
import useAcceptCuratorPopup from "./useAcceptCuratorPopup";

export default function MultiAssetChildBountyAcceptCurator() {
  const address = useRealAddress();
  const { parentBountyId, childBountyId } = useOnchainData();

  // Live on-chain status: accept_curator is only callable while the child is in
  // the `Funded` state (curator proposed, not accepted yet). Subscribing via
  // watchValue hides the button as soon as the accept lands, instead of waiting
  // for the scanner to catch up.
  const status = useMultiAssetChildBountyStatus(parentBountyId, childBountyId);
  const curator = status?.type === "Funded" ? status?.value?.curator : null;

  const { loading: isRoleLoading, roles, authority } = useAccountRole(curator);
  const { showPopup, popup } = useAcceptCuratorPopup(curator);

  // Whether an identical accept curator multisig is already in progress
  // on-chain (possibly initiated by others through a multisig the user is not
  // a member of), to warn the user against initiating a duplicate.
  const { pending: hasPendingAcceptCuratorMultisig, multisigAddresses } =
    usePendingAcceptCuratorMultisig(
      parentBountyId,
      childBountyId,
      curator,
      authority,
    );

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

  // accept_curator requires the child bounty to be in `Funded` state.
  if (!address || status?.type !== "Funded") {
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
    disabledTooltip = "Only the proposed curator can accept the role";
  }

  return (
    <div className="w-full">
      <Tooltip className="w-full" content={disabledTooltip}>
        <SplitRoleMenuButton
          fullWidth
          action="Accept Curator"
          roles={roles}
          disabled={!!disabledTooltip}
          onClick={showPopup}
        />
      </Tooltip>

      {hasPendingAcceptCuratorMultisig &&
        !disabledTooltip &&
        (canManagePendingMultisig ? (
          <div className="text-textSecondary text14Medium mt-2">
            There is an ongoing multisig about this bounty.{" "}
            <Link className="underline" href="/account/multisigs">
              Manage it here
            </Link>
          </div>
        ) : (
          <div className="text-textSecondary text14Medium mt-2">
            There is an ongoing multisig about this bounty.
          </div>
        ))}

      {popup}
    </div>
  );
}
