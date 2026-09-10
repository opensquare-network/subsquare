import SplitRoleMenuButton from "next-common/components/splitRoleMenuButton";
import Tooltip from "next-common/components/tooltip";
import Link from "next-common/components/link";
import { useOnchainData } from "next-common/context/post";
import useAccountRole from "next-common/hooks/accountAuthority/useAccountRole";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { isSameAddress } from "next-common/utils/isSameAddress";
import usePendingAcceptCuratorMultisig from "./usePendingAcceptCuratorMultisig";
import useMultiAssetBountyStatus from "../useMultiAssetBountyStatus";
import { useAcceptCuratorPopup } from "./useAcceptCuratorPopup";

export default function MultiAssetBountyAcceptCuratorButton() {
  const address = useRealAddress();
  const { bountyIndex } = useOnchainData();

  // Live on-chain status. Subscribes via watchValue so the button reacts as
  // soon as a tx changes the storage, e.g. after accept_curator lands the
  // status flips Funded -> Active and this button disappears by itself.
  const status = useMultiAssetBountyStatus(bountyIndex);

  // Proposed curator address from the on-chain bounty storage.
  const curator = status?.value?.curator;

  // A user may accept through several roles (e.g. several delegate multisigs),
  // each a different route; the split button lets the user pick one. The
  // authority also exposes multisig routes the user is NOT a member of.
  const { loading: isRoleLoading, roles, authority } = useAccountRole(curator);
  const { showPopupFn, component } = useAcceptCuratorPopup(
    bountyIndex,
    curator,
  );

  // Whether an identical accept curator multisig is already in progress
  // on-chain (possibly initiated by others through a multisig the user is not
  // a member of), to warn the user against initiating a duplicate.
  const { pending: hasPendingAcceptCuratorMultisig, multisigAddresses } =
    usePendingAcceptCuratorMultisig(bountyIndex, curator, authority);

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

  // accept_curator requires the bounty to be in `Funded` state. Actions also
  // require a connected account; hide the button when logged out.
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

      {component}
    </div>
  );
}
