import SplitRoleMenuButton from "next-common/components/splitRoleMenuButton";
import useAccountRole from "next-common/hooks/accountAuthority/useAccountRole";
import Tooltip from "next-common/components/tooltip";
import { useOnchainData, usePostState } from "next-common/context/post";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import useAcceptCuratorPopup from "./useAcceptCuratorPopup";

export default function MultiAssetChildBountyAcceptCurator() {
  const address = useRealAddress();
  const state = usePostState();
  const { curator } = useOnchainData();
  const { loading: isRoleLoading, roles } = useAccountRole(curator);
  const { showPopup, popup } = useAcceptCuratorPopup(curator);

  if (!address || state !== "Funded") {
    return null;
  }

  const isDisabled = isRoleLoading || roles.length === 0;
  const disabledTooltip =
    !isRoleLoading && roles.length === 0
      ? "Only the proposed curator can accept the role"
      : null;

  return (
    <>
      <Tooltip content={disabledTooltip}>
        <SplitRoleMenuButton
          fullWidth
          action="Accept Curator"
          roles={roles}
          disabled={isDisabled}
          onClick={showPopup}
        />
      </Tooltip>
      {popup}
    </>
  );
}
