import SplitRoleMenuButton from "next-common/components/splitRoleMenuButton";
import useAccountRole from "next-common/hooks/accountAuthority/useAccountRole";
import Tooltip from "next-common/components/tooltip";
import { useOnchainData } from "next-common/context/post";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import useMultiAssetBountyStatus from "../useMultiAssetBountyStatus";
import useAwardPopup from "./useAwardPopup";

// award_bounty can only be called on a bounty in the `Active` state, and the
// dispatch origin must be the bounty curator. We subscribe to the live
// on-chain status so the button hides itself right after the award lands.
export default function MultiAssetBountyAward() {
  const address = useRealAddress();
  const { bountyIndex } = useOnchainData();
  const status = useMultiAssetBountyStatus(bountyIndex);
  const curator = status?.value?.curator;

  const { loading: isRoleLoading, roles } = useAccountRole(curator);
  const { showPopup, popup } = useAwardPopup(curator);

  if (!address || status?.type !== "Active" || !curator) {
    return null;
  }

  const isDisabled = isRoleLoading || roles.length === 0;
  const disabledTooltip =
    !isRoleLoading && roles.length === 0
      ? "Only the bounty curator can award the bounty"
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
