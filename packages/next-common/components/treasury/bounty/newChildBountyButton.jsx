import BigNumber from "bignumber.js";
import { useOnchainData } from "next-common/context/post";
import PrimaryButton from "next-common/lib/button/primary";
import { useEffect, useState } from "react";
import NewChildBountyPopup from "./newChildBountyPopup";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import Tooltip from "next-common/components/tooltip";
import { isSameAddress } from "next-common/utils";
import { useContextPapiApi } from "next-common/context/papi";
import { useBountyStatus } from "./useBountyStatus";

function useParentChildBountiesCount(bountyIndex) {
  const papi = useContextPapiApi();
  const [count, setCount] = useState(null);

  useEffect(() => {
    if (!papi || !bountyIndex) {
      return;
    }

    const sub = papi.query.ChildBounties.ParentChildBounties.watchValue(
      bountyIndex,
    ).subscribe((value) => {
      setCount(value ?? 0);
    });

    return () => {
      sub?.unsubscribe?.();
    };
  }, [papi, bountyIndex]);

  return count;
}

function useMaxActiveChildBountyCount() {
  const papi = useContextPapiApi();
  const [count, setCount] = useState(Number.MAX_VALUE);

  useEffect(() => {
    if (!papi) {
      return;
    }

    papi.constants.ChildBounties.MaxActiveChildBountyCount().then((value) => {
      setCount(value ?? Number.MAX_VALUE);
    });
  }, [papi]);

  return count;
}

export default function NewChildBountyButton() {
  const address = useRealAddress();
  const [showPopup, setShowPopup] = useState(false);
  const onChain = useOnchainData();

  const { bountyIndex } = onChain;
  const status = useBountyStatus(bountyIndex);
  const childBountiesCount = useParentChildBountiesCount(bountyIndex);
  const maxActiveChildBountyCount = useMaxActiveChildBountyCount();

  // New bounty button is only available when the bounty is active
  if (status?.type !== "Active") {
    return null;
  }

  const curator = status?.value?.curator;

  let disabled = false;
  let disabledTooltip = "";

  const isCurator = isSameAddress(curator, address);

  if (!isCurator) {
    disabled = true;
    disabledTooltip = "Only curators can create a child bounty";
  } else if (
    new BigNumber(childBountiesCount ?? 0).gte(maxActiveChildBountyCount)
  ) {
    disabled = true;
    disabledTooltip = `This bounty has ${childBountiesCount} active child bounties which reach the max limit`;
  }

  return (
    <>
      <Tooltip content={disabledTooltip}>
        <PrimaryButton
          className="w-full"
          disabled={disabled}
          onClick={() => setShowPopup(true)}
        >
          New Child Bounty
        </PrimaryButton>
      </Tooltip>
      {showPopup && (
        <NewChildBountyPopup
          bountyIndex={bountyIndex}
          onClose={() => setShowPopup(false)}
        />
      )}
    </>
  );
}
