import SplitRoleMenuButton from "next-common/components/splitRoleMenuButton";
import useAccountRole from "next-common/hooks/accountAuthority/useAccountRole";
import Tooltip from "next-common/components/tooltip";
import { useOnchainData } from "next-common/context/post";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import useMultiAssetBountyStatus from "../useMultiAssetBountyStatus";
import useMultiAssetActiveChildBountyCount from "../useMultiAssetActiveChildBountyCount";
import useAwardPopup from "./useAwardPopup";

// award_bounty can only be called on a bounty in the `Active` state, and the
// dispatch origin must be the bounty curator. On chain a parent bounty can
// only be awarded when it has NO active child bounties in storage
// (ChildBountiesPerParent == 0): its payout is the recorded value minus all
// child values allocated so far, so with children still in storage the runtime
// rejects the call with `HasActiveChildBounty`. We subscribe to the live
// on-chain status and child count so the button reflects state as soon as
// anything lands.
export default function MultiAssetBountyAward() {
  const address = useRealAddress();
  const { bountyIndex } = useOnchainData();
  const status = useMultiAssetBountyStatus(bountyIndex);
  const curator = status?.value?.curator;
  const childBountiesCount = useMultiAssetActiveChildBountyCount(bountyIndex);

  const { loading: isRoleLoading, roles } = useAccountRole(curator);
  const { showPopup, popup } = useAwardPopup(curator);

  if (!address || status?.type !== "Active" || !curator) {
    return null;
  }

  let disabledTooltip = "";
  if (isRoleLoading) {
    disabledTooltip = "Loading curator roles";
  } else if (roles.length === 0) {
    disabledTooltip = "Only the bounty curator can award the bounty";
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
          action="Award"
          roles={roles}
          disabled={!!disabledTooltip}
          onClick={showPopup}
        />
      </Tooltip>
      {popup}
    </div>
  );
}
