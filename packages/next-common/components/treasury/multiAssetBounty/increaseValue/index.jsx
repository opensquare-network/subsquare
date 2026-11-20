import SplitRoleMenuButton from "next-common/components/splitRoleMenuButton";
import useAccountRole from "next-common/hooks/accountAuthority/useAccountRole";
import Tooltip from "next-common/components/tooltip";
import { useOnchainData } from "next-common/context/post";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import useMultiAssetBountyStatus from "../useMultiAssetBountyStatus";
import useIncreaseValuePopup from "./useIncreaseValuePopup";

// increase_value registers funds that reached the bounty account after
// creation (e.g. recurring top-ups) in the recorded value. Only the curator of
// an `Active` bounty can call it, and the value can never be lowered again.
// It exists for parent bounties only, there is no child bounty variant.
export default function MultiAssetBountyIncreaseValue() {
  const address = useRealAddress();
  const { bountyIndex } = useOnchainData();
  const status = useMultiAssetBountyStatus(bountyIndex);

  // Read the curator from the live on-chain status so the button reacts as
  // soon as the curator changes on chain.
  const curator = status?.value?.curator;
  const { loading: isRoleLoading, roles } = useAccountRole(curator);
  const { showPopup, popup } = useIncreaseValuePopup(curator);

  if (!address || status?.type !== "Active" || !curator) {
    return null;
  }

  let disabledTooltip = "";
  if (isRoleLoading) {
    disabledTooltip = "Loading curator roles";
  } else if (roles.length === 0) {
    disabledTooltip = "Only the bounty curator can increase the value";
  }

  // The tooltip wraps the button in an `inline-block` div, so it must carry
  // `w-full` as well: otherwise the wrapper shrinks to the content width and
  // the `fullWidth` button inside has nothing to stretch to.
  return (
    <div className="w-full">
      <Tooltip className="w-full" content={disabledTooltip}>
        <SplitRoleMenuButton
          fullWidth
          action="Increase Value"
          roles={roles}
          disabled={!!disabledTooltip}
          onClick={showPopup}
        />
      </Tooltip>
      {popup}
    </div>
  );
}
