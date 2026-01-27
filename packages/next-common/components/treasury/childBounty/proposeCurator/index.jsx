import React, { useEffect, useState } from "react";
import useProposeCuratorPopup from "./useProposeCurator";
import PrimaryButton from "next-common/lib/button/primary";
import { useOnchainData } from "next-common/context/post";
import Tooltip from "next-common/components/tooltip";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { isSameAddress } from "next-common/utils";
import { has } from "lodash-es";
import { usePageProps } from "next-common/context/page";


function getParentBountyStatus(parentBountyData) {
  const { onchainData } = parentBountyData ?? {};
  return onchainData?.meta?.status || {};
}

function isParentBountyCurator(status = {}, address) {
  for (const item of Object.values(status)) {
    if (item?.curator && isSameAddress(item.curator, address)) {
      return true;
    }
  }
  return false;
}

export default function ProposeCurator() {
  const address = useRealAddress();
  const [isDisabled, setIsDisabled] = useState(true);
  const [disabledTooltip, setDisabledTooltip] = useState("");
  const { showPopupFn, component: ProposeCuratorPopup } =
    useProposeCuratorPopup();
  const { meta } = useOnchainData();
  const { parentBounty } = usePageProps();
  const { status = {} } = meta || {};
  const isAddedState = has(status, "added");

  // The dispatch origin for this call must be curator of parent bounty.
  useEffect(() => {
    if (!parentBounty) {
      return;
    }
    const parentBountyStatus = getParentBountyStatus(parentBounty);
    const isParentCurator = isParentBountyCurator(parentBountyStatus, address);
    setIsDisabled(!isParentCurator);

    if (!isParentCurator) {
      const disabledTooltipContent =
        "Only parent bounty curator can propose a curator";
      setDisabledTooltip(disabledTooltipContent);
    }
  }, [address, parentBounty]);

  if (!address || !isAddedState) {
    return null;
  }

  return (
    <>
      <Tooltip content={disabledTooltip}>
        <PrimaryButton
          className="w-full"
          onClick={() => showPopupFn()}
          disabled={isDisabled}
        >
          Propose Curator
        </PrimaryButton>
      </Tooltip>
      {ProposeCuratorPopup}
    </>
  );
}
