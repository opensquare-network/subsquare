import SplitRoleMenuButton from "next-common/components/splitRoleMenuButton";
import useAccountRole from "next-common/hooks/accountAuthority/useAccountRole";
import Tooltip from "next-common/components/tooltip";
import { useOnchainData, usePostState } from "next-common/context/post";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import useAwardPopup from "./useAwardPopup";

export default function MultiAssetChildBountyAward() {
  const address = useRealAddress();
  const state = usePostState();
  const { curator } = useOnchainData();
  const { loading: isRoleLoading, roles } = useAccountRole(curator);
  const { showPopup, popup } = useAwardPopup(curator);

  if (!address || state !== "Active") {
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
