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

// close_bounty(child) is callable while the child is Funded/Active
// (CuratorUnassigned after the curator leaves). On chain the dispatch origin
// can be the child curator (when one exists) or the parent curator;
// RejectOrigin can also close, but that is out of scope for a user-facing
// button.
//
// Whether the connected account can act as a curator is decided by its
// account roles (direct / proxy delegate / multisig signatory) for that
// curator address. Button rules:
//  - if the account can act as the child curator  -> show only that route;
//  - else if it can act as the parent curator     -> show only that route;
//  - if it can act as both, the child curator route wins;
//  - if it can act as neither, show a disabled button with a tooltip.
const CLOSEABLE_STATES = ["Funded", "Active", "CuratorUnassigned"];

export default function MultiAssetChildBountyCloseBounty() {
  const address = useRealAddress();
  const state = usePostState();
  const {
    parentBountyId,
    childBountyId,
    curator: childCurator,
  } = useOnchainData();
  const { parentBounty } = usePageProps();
  const parentCurator = parentBounty?.onchainData?.curator;

  // useAccountRole(origin) resolves every route the current user has to
  // dispatch with `origin`; it returns [] when the user is not that curator
  // (nor one of its proxy delegates / multisig signatories).
  const childCuratorRole = useAccountRole(childCurator);
  const parentCuratorRole = useAccountRole(parentCurator);

  const childRolesLoading = !!childCurator && childCuratorRole.loading;
  const parentRolesLoading = !!parentCurator && parentCuratorRole.loading;
  const canActAsChildCurator =
    !!childCurator && !childRolesLoading && childCuratorRole.roles.length > 0;
  const canActAsParentCurator =
    !!parentCurator &&
    !parentRolesLoading &&
    parentCuratorRole.roles.length > 0;

  // Pick a single origin for the button. A child in Funded/Active still has a
  // child curator, and the child curator route takes priority over the parent
  // curator route. A child in CuratorUnassigned has no child curator, so only
  // the parent curator can close it.
  let origin = null;
  let roles = [];
  let authority = null;
  let disabledTooltip = "";

  if (childCurator) {
    if (childRolesLoading) {
      disabledTooltip = "Loading curator roles";
    } else if (canActAsChildCurator) {
      origin = childCurator;
      roles = childCuratorRole.roles;
      authority = childCuratorRole.authority;
    } else if (parentRolesLoading) {
      disabledTooltip = "Loading curator roles";
    } else if (canActAsParentCurator) {
      origin = parentCurator;
      roles = parentCuratorRole.roles;
      authority = parentCuratorRole.authority;
    } else {
      disabledTooltip =
        "Only the child or parent bounty curator can close the child bounty";
    }
  } else if (parentCurator) {
    if (parentRolesLoading) {
      disabledTooltip = "Loading curator roles";
    } else if (canActAsParentCurator) {
      origin = parentCurator;
      roles = parentCuratorRole.roles;
      authority = parentCuratorRole.authority;
    } else {
      disabledTooltip =
        "Only the parent bounty curator can close the child bounty";
    }
  }

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

  const isDisabled = !!disabledTooltip;

  // No curator is assigned to this child at all: only governance (RejectOrigin)
  // could close it, which is out of scope for a user-facing button.
  if (
    !address ||
    !CLOSEABLE_STATES.includes(state) ||
    (!childCurator && !parentCurator)
  ) {
    return null;
  }

  return (
    <div className="w-full">
      <Tooltip className="w-full" content={disabledTooltip}>
        <SplitRoleMenuButton
          fullWidth
          action="Close Bounty"
          roles={roles}
          disabled={isDisabled}
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
