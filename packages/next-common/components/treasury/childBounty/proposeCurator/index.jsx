import React, { useEffect, useState } from "react";
import useProposeCuratorPopup from "./useProposeCurator";
import PrimaryButton from "next-common/lib/button/primary";
import { useOnchainData } from "next-common/context/post";
import Tooltip from "next-common/components/tooltip";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import useSubStorage from "next-common/hooks/common/useSubStorage";
import CuratorActionHint from "../../common/curatorActionHint";

function useSubParentBountyData(bountyIndex) {
  const { result, loading } = useSubStorage("bounties", "bounties", [
    bountyIndex,
  ]);
  const data = result?.toJSON();

  return {
    status: data?.status,
    loading,
  };
}

function useSubChildBountyIsAdded(parentBountyId, index) {
  const { loading, result: onChainStorage } = useSubStorage(
    "childBounties",
    "childBounties",
    [parentBountyId, index],
  );

  if (loading || !onChainStorage?.isSome) {
    return false;
  }
  const { status } = onChainStorage.toJSON();
  if (!status || !("added" in status)) {
    return false;
  }
  return true;
}

function isParentBountyCurator(status = {}, address) {
  for (const item of Object.values(status)) {
    if (item?.curator && item.curator === address) {
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
  const { parentBountyId, index } = useOnchainData();
  const { status, loading } = useSubParentBountyData(parentBountyId);
  const isAddedState = useSubChildBountyIsAdded(parentBountyId, index);

  // The dispatch origin for this call must be curator of parent bounty.
  useEffect(() => {
    if (loading) {
      return;
    }

    const isParentCurator = isParentBountyCurator(status, address);
    setIsDisabled(!isParentCurator);

    if (!isParentCurator) {
      const disabledTooltipContent =
        "Only parent bounty curator can propose a curator";
      setDisabledTooltip(disabledTooltipContent);
    }
  }, [loading, address, status]);

  if (!address || !isAddedState) {
    return null;
  }

  return (
    <>
      <div>
        <Tooltip content={disabledTooltip} className="w-full">
          <PrimaryButton
            className="w-full"
            onClick={() => showPopupFn()}
            disabled={isDisabled}
          >
            Propose Curator
          </PrimaryButton>
        </Tooltip>

        <CuratorActionHint className="mt-4" />
      </div>

      {ProposeCuratorPopup}
    </>
  );
}
