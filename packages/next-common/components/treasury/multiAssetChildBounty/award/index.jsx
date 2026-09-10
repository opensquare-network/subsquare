import SplitRoleMenuButton from "next-common/components/splitRoleMenuButton";
import useAccountRole from "next-common/hooks/accountAuthority/useAccountRole";
import Tooltip from "next-common/components/tooltip";
import { useOnchainData } from "next-common/context/post";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import useMultiAssetChildBountyStatus from "../useMultiAssetChildBountyStatus";
import useAwardPopup from "./useAwardPopup";

// award_bounty(child) can only be called on a child in the `Active` state, and
// the dispatch origin must be the child bounty curator. We subscribe to the
// live on-chain child status so the button reflects state as soon as anything
// lands, instead of relying on the scanner's display state.
export default function MultiAssetChildBountyAward() {
  const address = useRealAddress();
  const { parentBountyId, childBountyId } = useOnchainData();

  // Live on-chain status: the child curator is part of the `Active` status.
  const status = useMultiAssetChildBountyStatus(parentBountyId, childBountyId);
  const curator = status?.type === "Active" ? status?.value?.curator : null;

  const { loading: isRoleLoading, roles } = useAccountRole(curator);
  const { showPopup, popup } = useAwardPopup(curator);

  if (!address || status?.type !== "Active" || !curator) {
    return null;
  }

  const isDisabled = isRoleLoading || roles.length === 0;
  const disabledTooltip =
    !isRoleLoading && roles.length === 0
      ? "Only the child bounty curator can award the bounty"
      : null;

  return (
    <>
      <Tooltip content={disabledTooltip}>
        <SplitRoleMenuButton
          fullWidth
          action="Award"
          roles={roles}
          disabled={isDisabled}
          onClick={showPopup}
        />
      </Tooltip>
      {popup}
    </>
  );
}
