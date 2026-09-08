import SplitRoleMenuButton from "next-common/components/splitRoleMenuButton";
import useAccountRole from "next-common/hooks/accountAuthority/useAccountRole";
import Tooltip from "next-common/components/tooltip";
import { usePostState } from "next-common/context/post";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { usePageProps } from "next-common/context/page";
import useProposeCuratorPopup from "./useProposeCuratorPopup";

export default function MultiAssetChildBountyProposeCurator() {
  const address = useRealAddress();
  const state = usePostState();
  const { parentBounty } = usePageProps();
  const parentCurator = parentBounty?.onchainData?.curator;
  const { loading: isRoleLoading, roles } = useAccountRole(parentCurator);
  const { showPopup, popup } = useProposeCuratorPopup(parentCurator);

  if (!address || state !== "CuratorUnassigned") {
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
