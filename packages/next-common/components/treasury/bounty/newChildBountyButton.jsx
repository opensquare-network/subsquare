import { useOnchainData } from "next-common/context/post";
import PrimaryButton from "next-common/lib/button/primary";
import { useState } from "react";
import NewChildBountyPopup from "./newChildBountyPopup";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import Tooltip from "next-common/components/tooltip";
import { usePageProps } from "next-common/context/page";
import { useContextApi } from "next-common/context/api";
import { useCurator } from "next-common/context/treasury/bounties";

export default function NewChildBountyButton() {
  const address = useRealAddress();
  const [showPopup, setShowPopup] = useState(false);
  const onChain = useOnchainData();
  const { childBounties } = usePageProps();
  const api = useContextApi();
  const curator = useCurator();

  const { bountyIndex, state } = onChain;
  const isActive = state.state === "Active";
  if (!isActive) {
    return null;
  }

  let disabled = false;
  let disabledTooltip = "";

  const isCurator = curator === address;
  if (!isCurator) {
    disabled = true;
    disabledTooltip = "You are not the curator";
  } else {
    const maxActiveChildBountyCount =
      api?.consts.childBounties.maxActiveChildBountyCount.toNumber();
    if (childBounties?.total >= maxActiveChildBountyCount) {
      disabled = true;
      disabledTooltip = "Max active child bounties reached";
    }
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
