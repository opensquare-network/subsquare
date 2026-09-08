import React, { useEffect, useState } from "react";
import { useOnchainData } from "next-common/context/post";
import NewChildBountyPopup from "./newChildBountyPopup";
import PrimaryButton from "next-common/lib/button/primary";
import { useContextPapi } from "next-common/context/papi";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { isSameAddress } from "next-common/utils";
import Tooltip from "next-common/components/tooltip";

function useMultiAssetBountyStatus(bountyIndex) {
  const { api: papi, checkPallet } = useContextPapi();
  const [bounty, setBounty] = useState(null);

  useEffect(() => {
    setBounty(null);
    if (
      !papi ||
      bountyIndex == null ||
      !checkPallet("MultiAssetBounties", "Bounties")
    ) {
      return;
    }

    const bountySub = papi.query.MultiAssetBounties.Bounties.watchValue(
      bountyIndex,
    ).subscribe({
      next: ({ value }) => setBounty(value ?? null),
      error: (error) => {
        setBounty(null);
        console.error(error);
      },
    });
    return () => bountySub.unsubscribe();
  }, [papi, bountyIndex, checkPallet]);

  return bounty?.status;
}

function useMultiAssetChildBountyLimit(bountyIndex) {
  const { api: papi, checkPallet } = useContextPapi();
  const [childBountiesCount, setChildBountiesCount] = useState(null);
  const [maxActiveChildBountyCount, setMaxActiveChildBountyCount] =
    useState(null);

  useEffect(() => {
    setChildBountiesCount(null);
    setMaxActiveChildBountyCount(null);
    if (
      !papi ||
      bountyIndex == null ||
      !checkPallet("MultiAssetBounties", "ChildBountiesPerParent")
    ) {
      return;
    }

    let cancelled = false;
    const countSub =
      papi.query.MultiAssetBounties.ChildBountiesPerParent.watchValue(
        bountyIndex,
      ).subscribe({
        next: ({ value }) => setChildBountiesCount(value ?? 0),
        error: (error) => {
          setChildBountiesCount(null);
          console.error(error);
        },
      });
    papi.constants.MultiAssetBounties.MaxActiveChildBountyCount()
      .then((value) => {
        if (!cancelled) {
          setMaxActiveChildBountyCount(value);
        }
      })
      .catch((error) => console.error(error));

    return () => {
      cancelled = true;
      countSub.unsubscribe();
    };
  }, [papi, bountyIndex, checkPallet]);

  return { childBountiesCount, maxActiveChildBountyCount };
}

export default function NewChildBountyButton() {
  const address = useRealAddress();
  const { bountyIndex } = useOnchainData();
  const [open, setOpen] = useState(false);
  const status = useMultiAssetBountyStatus(bountyIndex);
  const { childBountiesCount, maxActiveChildBountyCount } =
    useMultiAssetChildBountyLimit(bountyIndex);

  if (bountyIndex == null || status?.type !== "Active") {
    return null;
  }

  const curator = status.value.curator;
  let disabledTooltip = "";
  if (!isSameAddress(curator, address)) {
    disabledTooltip = "Only curators can create a child bounty";
  } else if (childBountiesCount == null || maxActiveChildBountyCount == null) {
    disabledTooltip = "Loading child bounty limit";
  } else if (childBountiesCount >= maxActiveChildBountyCount) {
    disabledTooltip = `This bounty has ${childBountiesCount} active child bounties which reach the max limit`;
  }

  return (
    <>
      <Tooltip content={disabledTooltip}>
        <PrimaryButton
          className="w-full"
          disabled={!!disabledTooltip}
          onClick={() => setOpen(true)}
        >
          New Child Bounty
        </PrimaryButton>
      </Tooltip>
      {open && !disabledTooltip && (
        <NewChildBountyPopup onClose={() => setOpen(false)} />
      )}
    </>
  );
}
