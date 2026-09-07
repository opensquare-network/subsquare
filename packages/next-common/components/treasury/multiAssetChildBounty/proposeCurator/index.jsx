import PrimaryButton from "next-common/lib/button/primary";
import Tooltip from "next-common/components/tooltip";
import { useOnchainData } from "next-common/context/post";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { isSameAddress } from "next-common/utils";
import useMultiAssetChildBountyStatus from "next-common/components/treasury/multiAssetChildBounty/useMultiAssetChildBountyStatus";
import { usePageProps } from "next-common/context/page";
import useProposeCuratorPopup from "./useProposeCuratorPopup";

export default function MultiAssetChildBountyProposeCurator() {
  const address = useRealAddress();
  const { parentBountyId, childBountyId } = useOnchainData();
  const { parentBounty } = usePageProps();
  const { status: childBountyStatus, loading: isChildBountyLoading } =
    useMultiAssetChildBountyStatus(parentBountyId, childBountyId);
  const { showPopup, popup } = useProposeCuratorPopup();

  if (
    !address ||
    isChildBountyLoading ||
    childBountyStatus?.type !== "CuratorUnassigned"
  ) {
    return null;
  }

  const parentCurator = parentBounty?.onchainData?.curator;
  const isParentCurator = isSameAddress(parentCurator, address);
  const isDisabled = !isParentCurator;
  const disabledTooltip = isDisabled
    ? "Only parent bounty curator can propose a curator"
    : null;

  return (
    <>
      <Tooltip content={disabledTooltip}>
        <PrimaryButton
          className="w-full"
          disabled={isDisabled}
          onClick={showPopup}
        >
          Propose Curator
        </PrimaryButton>
      </Tooltip>
      {popup}
    </>
  );
}
