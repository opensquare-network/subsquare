import SplitRoleMenuButton from "next-common/components/splitRoleMenuButton";
import useAccountRole from "next-common/hooks/accountAuthority/useAccountRole";
import Tooltip from "next-common/components/tooltip";
import Link from "next-common/components/link";
import { useOnchainData } from "next-common/context/post";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { isSameAddress } from "next-common/utils/isSameAddress";
import useMultiAssetBountyStatus from "../useMultiAssetBountyStatus";
import useMultiAssetActiveChildBountyCount from "../useMultiAssetActiveChildBountyCount";
import usePendingCloseBountyMultisig from "./usePendingCloseBountyMultisig";
import useCloseBountyPopup from "./useCloseBountyPopup";

// close_bounty can be called by the curator (or RejectOrigin) when the bounty
// is in `Funded` or `Active`, refunding the pot back to the treasury. On chain
// a parent bounty can only be closed when it has NO active child bounties in
// storage (ChildBountiesPerParent == 0). We subscribe to the live on-chain
// status so the button reflects the state as soon as anything lands.
const CLOSEABLE_STATUSES = ["Funded", "Active"];

export default function MultiAssetBountyCloseBounty() {
  const address = useRealAddress();
  const { bountyIndex } = useOnchainData();
  const status = useMultiAssetBountyStatus(bountyIndex);
  const curator = status?.value?.curator;
  const childBountiesCount = useMultiAssetActiveChildBountyCount(bountyIndex);

  // The authority also exposes multisig routes the user is NOT a member of.
  const { loading: isRoleLoading, roles, authority } = useAccountRole(curator);
  const { showPopup, popup } = useCloseBountyPopup(curator);

  // Whether an identical close bounty multisig is already in progress on-chain
  // (possibly initiated by others through a multisig the user is not a member
  // of), to warn the user against initiating a duplicate.
  const { pending: hasPendingCloseBountyMultisig, multisigAddresses } =
    usePendingCloseBountyMultisig(bountyIndex, curator, authority);

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

  if (!address || !CLOSEABLE_STATUSES.includes(status?.type) || !curator) {
    return null;
  }

  let disabledTooltip = "";
  if (isRoleLoading) {
    disabledTooltip = "Loading curator roles";
  } else if (roles.length === 0) {
    disabledTooltip = "Only the bounty curator can close the bounty";
  } else if (childBountiesCount == null) {
    disabledTooltip = "Loading child bounties";
  } else if (childBountiesCount > 0) {
    disabledTooltip = "This bounty still has active child bounties";
  }

  // The tooltip wraps the button in an `inline-block` div, so it must carry
  // `w-full` as well: otherwise the wrapper shrinks to the content width and
  // the `fullWidth` button inside has nothing to stretch to.
  return (
    <div className="w-full">
      <Tooltip className="w-full" content={disabledTooltip}>
        <SplitRoleMenuButton
          fullWidth
          action="Close Bounty"
          roles={roles}
          disabled={!!disabledTooltip}
          onClick={showPopup}
        />
      </Tooltip>

      {hasPendingCloseBountyMultisig &&
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
