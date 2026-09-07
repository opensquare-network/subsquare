import PrimaryButton from "next-common/lib/button/primary";
import Tooltip from "next-common/components/tooltip";
import { useOnchainData, usePostState } from "next-common/context/post";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { isSameAddress } from "next-common/utils";
import useAcceptCuratorPopup from "./useAcceptCuratorPopup";

export default function MultiAssetChildBountyAcceptCurator() {
  const address = useRealAddress();
  const state = usePostState();
  const { curator } = useOnchainData();
  const { showPopup, popup } = useAcceptCuratorPopup();

  if (!address || state !== "Funded") {
    return null;
  }

  const isCurator = isSameAddress(curator, address);
  const disabledTooltip = isCurator
    ? null
    : "Only the proposed curator can accept the role";

  return (
    <>
      <Tooltip content={disabledTooltip}>
        <PrimaryButton
          className="w-full"
          disabled={!isCurator}
          onClick={showPopup}
        >
          Accept Curator
        </PrimaryButton>
      </Tooltip>
      {popup}
    </>
  );
}
