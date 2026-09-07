import PrimaryButton from "next-common/lib/button/primary";
import Tooltip from "next-common/components/tooltip";
import { useOnchainData, usePostState } from "next-common/context/post";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { isSameAddress } from "next-common/utils";
import useAwardPopup from "./useAwardPopup";

export default function MultiAssetChildBountyAward() {
  const address = useRealAddress();
  const state = usePostState();
  const { curator } = useOnchainData();
  const { showPopup, popup } = useAwardPopup();

  if (!address || state !== "Active") {
    return null;
  }

  const isCurator = isSameAddress(curator, address);
  const disabledTooltip = isCurator
    ? null
    : "Only the child bounty curator can award the bounty";

  return (
    <>
      <Tooltip content={disabledTooltip}>
        <PrimaryButton
          className="w-full"
          disabled={!isCurator}
          onClick={showPopup}
        >
          Award
        </PrimaryButton>
      </Tooltip>
      {popup}
    </>
  );
}
