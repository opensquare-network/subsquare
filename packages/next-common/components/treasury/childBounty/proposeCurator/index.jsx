import React, { useEffect, useState } from "react";
import { useProposeCuratorPopup } from "./useProposeCurator";
import PrimaryButton from "next-common/lib/button/primary";
import { usePostState, useOnchainData } from "next-common/context/post";
import Tooltip from "next-common/components/tooltip";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import useSubStorage from "next-common/hooks/common/useSubStorage";

function useSubParentBountyOnChainData(bountyIndex) {
  const { result, loading } = useSubStorage("bounties", "bounties", [
    bountyIndex,
  ]);
  const data = result?.toJSON();
  return {
    data: data,
    loading,
  };
}

function isParentBountyCuratorInActive(status = null, address) {
  const isActive = status?.active;
  return isActive && isActive.curator === address;
}

export default function ProposeCurator() {
  const address = useRealAddress();
  const chainState = usePostState();
  const [isDisabled, setIsDisabled] = useState(true);
  const [disabledTooltip, setDisabledTooltip] = useState("");
  const { showPopup, component: ProposeCuratorPopup } =
    useProposeCuratorPopup();
  const { parentBountyId } = useOnchainData();
  const { data, loading } = useSubParentBountyOnChainData(parentBountyId);

  // The dispatch origin for this call must be curator of parent bounty.
  useEffect(() => {
    if (loading) {
      return;
    }

    const isParentCurator = isParentBountyCuratorInActive(
      data?.status,
      address,
    );
    setIsDisabled(!isParentCurator);

    if (!isParentCurator) {
      const disabledTooltipContent =
        "Only parent bounty curator can propose a curator";
      setDisabledTooltip(disabledTooltipContent);
    }
  }, [loading]);

  if (!address || chainState !== "Added") {
    return null;
  }

  return (
    <>
      <Tooltip content={disabledTooltip}>
        <PrimaryButton
          className="w-full"
          onClick={() => showPopup()}
          disabled={isDisabled}
        >
          Propose Curator
        </PrimaryButton>
      </Tooltip>
      {ProposeCuratorPopup}
    </>
  );
}
