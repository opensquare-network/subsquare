import React, { useEffect, useState } from "react";
import useProposeCuratorPopup from "./useProposeCurator";
import PrimaryButton from "next-common/lib/button/primary";
import { useOnchainData } from "next-common/context/post";
import Tooltip from "next-common/components/tooltip";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { isSameAddress } from "next-common/utils";
import { useContextPapiApi } from "next-common/context/papi";

function useSubParentBountyData(bountyIndex) {
  const papi = useContextPapiApi();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!papi || !bountyIndex) {
      return;
    }

    setLoading(true);
    const sub = papi.query.Bounties.Bounties.watchValue(bountyIndex).subscribe(
      (result) => {
        setData(result ?? null);
        setLoading(false);
      },
    );

    return () => {
      sub?.unsubscribe?.();
    };
  }, [papi, bountyIndex]);

  return {
    status: data?.status,
    loading,
  };
}

function useSubChildBountyIsAdded(parentBountyId, index) {
  const papi = useContextPapiApi();
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    if (!papi || !parentBountyId || !index) {
      return;
    }

    const sub = papi.query.ChildBounties.ChildBounties.watchValue(
      parentBountyId,
      index,
    ).subscribe((result) => {
      setIsAdded(result?.status?.type === "Added");
    });

    return () => {
      sub?.unsubscribe?.();
    };
  }, [papi, parentBountyId, index]);

  return isAdded;
}

function isParentBountyCurator(status = {}, address) {
  const { curator } = status?.value ?? {};
  if (curator && isSameAddress(curator, address)) {
    return true;
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
