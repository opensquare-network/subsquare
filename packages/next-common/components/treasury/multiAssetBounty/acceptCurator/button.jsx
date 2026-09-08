import SplitRoleMenuButton from "next-common/components/splitRoleMenuButton";
import Tooltip from "next-common/components/tooltip";
import { useOnchainData } from "next-common/context/post";
import useAccountRole from "next-common/hooks/accountAuthority/useAccountRole";
import useMultiAssetBountyStatus from "../useMultiAssetBountyStatus";
import { useAcceptCuratorPopup } from "./useAcceptCuratorPopup";

export default function MultiAssetBountyAcceptCuratorButton() {
  const { bountyIndex } = useOnchainData();

  // Live on-chain status. Subscribes via watchValue so the button reacts as
  // soon as a tx changes the storage, e.g. after accept_curator lands the
  // status flips Funded -> Active and this button disappears by itself.
  const status = useMultiAssetBountyStatus(bountyIndex);

  // Proposed curator address from the on-chain bounty storage.
  const curator = status?.value?.curator;

  // A user may accept through several roles (e.g. several delegate multisigs),
  // each a different route; the split button lets the user pick one.
  const { loading: isRoleLoading, roles } = useAccountRole(curator);
  const { showPopupFn, component } = useAcceptCuratorPopup(
    bountyIndex,
    curator,
  );

  // accept_curator requires the bounty to be in `Funded` state.
  if (status?.type !== "Funded") {
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
    <>
      <Tooltip content={disabledTooltip}>
        <SplitRoleMenuButton
          fullWidth
          action="Accept Curator"
          roles={roles}
          disabled={!!disabledTooltip}
          onClick={(role) => showPopupFn(role)}
        />
      </Tooltip>

      {component}
    </>
  );
}
