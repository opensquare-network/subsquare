import SplitRoleMenuButton from "next-common/components/splitRoleMenuButton";
import useAccountRole from "next-common/hooks/accountAuthority/useAccountRole";
import Tooltip from "next-common/components/tooltip";
import { useOnchainData } from "next-common/context/post";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import useMultiAssetChildBountyStatus from "../useMultiAssetChildBountyStatus";
import useMultiAssetBountyStatus from "../../multiAssetBounty/useMultiAssetBountyStatus";
import useProposeCuratorPopup from "./useProposeCuratorPopup";

// propose_curator(child) can only be called while the child is in the
// `CuratorUnassigned` state (after the previous curator was unassigned), and
// the dispatch origin must be the parent bounty curator. On success the child
// moves to `Funded`, awaiting the proposed curator's accept_curator.
//
// We subscribe to the live on-chain status of both the child and its parent
// bounty, so the button reflects state as soon as anything lands instead of
// relying on the scanner's display state.
export default function MultiAssetChildBountyProposeCurator() {
  const address = useRealAddress();
  const { parentBountyId, childBountyId } = useOnchainData();

  // Live on-chain statuses: the parent curator is read from chain storage so
  // the button does not depend on the scanner's display state.
  const status = useMultiAssetChildBountyStatus(parentBountyId, childBountyId);
  const parentStatus = useMultiAssetBountyStatus(parentBountyId);

  // Only the parent bounty curator can propose a curator for a child bounty,
  // and only while the parent is Funded/Active (i.e. it still has a curator).
  const parentCurator =
    parentStatus?.type === "Funded" || parentStatus?.type === "Active"
      ? parentStatus?.value?.curator
      : null;

  const { loading: isRoleLoading, roles } = useAccountRole(parentCurator);
  const { showPopup, popup } = useProposeCuratorPopup(parentCurator);

  // propose_curator requires the child to be in the `CuratorUnassigned` state.
  if (!address || status?.type !== "CuratorUnassigned" || !parentCurator) {
    return null;
  }

  const isDisabled = isRoleLoading || roles.length === 0;
  const disabledTooltip =
    !isRoleLoading && roles.length === 0
      ? "Only parent bounty curator can propose a curator"
      : null;

  return (
    <>
      <Tooltip content={disabledTooltip}>
        <SplitRoleMenuButton
          fullWidth
          action="Propose Curator"
          roles={roles}
          disabled={isDisabled}
          onClick={showPopup}
        />
      </Tooltip>
      {popup}
    </>
  );
}
