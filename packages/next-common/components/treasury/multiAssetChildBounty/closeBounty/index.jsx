import SplitRoleMenuButton from "next-common/components/splitRoleMenuButton";
import useAccountRole from "next-common/hooks/accountAuthority/useAccountRole";
import Tooltip from "next-common/components/tooltip";
import Link from "next-common/components/link";
import { useOnchainData, usePostState } from "next-common/context/post";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { usePageProps } from "next-common/context/page";
import { isSameAddress } from "next-common/utils/isSameAddress";
import usePendingCloseBountyMultisig from "./usePendingCloseBountyMultisig";
import useCloseBountyPopup from "./useCloseBountyPopup";

// close_bounty(child) is callable when the child is Funded/Active (by the
// child curator) or CuratorUnassigned (by the parent curator, since the child
// has no curator). RejectOrigin can also close, but that is out of scope for a
// user-facing button.
const CLOSEABLE_STATES = ["Funded", "Active", "CuratorUnassigned"];

export default function MultiAssetChildBountyCloseBounty() {
  const address = useRealAddress();
  const state = usePostState();
  const { parentBountyId, childBountyId, curator } = useOnchainData();
  const { parentBounty } = usePageProps();
  const parentCurator = parentBounty?.onchainData?.curator;

  // Who must dispatch close_bounty depends on the state: the child curator
  // when one exists (Funded/Active), otherwise the parent curator
  // (CuratorUnassigned).
  const isCuratorUnassigned = state === "CuratorUnassigned";
  const origin = isCuratorUnassigned ? parentCurator : curator;

  // The authority also exposes multisig routes the user is NOT a member of.
  const { loading: isRoleLoading, roles, authority } = useAccountRole(origin);
  const { showPopup, popup } = useCloseBountyPopup(origin);

  // Whether an identical close bounty multisig is already in progress on-chain
  // (possibly initiated by others through a multisig the user is not a member
  // of), to warn the user against initiating a duplicate.
  const { pending: hasPendingCloseBountyMultisig, multisigAddresses } =
    usePendingCloseBountyMultisig(
      parentBountyId,
      childBountyId,
      origin,
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

  if (!address || !CLOSEABLE_STATES.includes(state) || !origin) {
    return null;
  }

  let disabledTooltip = "";
  if (isRoleLoading) {
    disabledTooltip = "Loading curator roles";
  } else if (roles.length === 0) {
    disabledTooltip = isCuratorUnassigned
      ? "Only the parent bounty curator can close the child bounty"
      : "Only the child bounty curator can close the child bounty";
  }

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
