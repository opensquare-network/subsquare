import PrimaryButton from "next-common/lib/button/primary";
import Tooltip from "next-common/components/tooltip";
import { usePostState } from "next-common/context/post";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { isSameAddress } from "next-common/utils";
import { usePageProps } from "next-common/context/page";
import useProposeCuratorPopup from "./useProposeCuratorPopup";

export default function MultiAssetChildBountyProposeCurator() {
  const address = useRealAddress();
  const state = usePostState();
  const { parentBounty } = usePageProps();
  const { showPopup, popup } = useProposeCuratorPopup();

  if (!address || state !== "CuratorUnassigned") {
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
