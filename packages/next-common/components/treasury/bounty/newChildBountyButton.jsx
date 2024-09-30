import { useOnchainData } from "next-common/context/post";
import PrimaryButton from "next-common/lib/button/primary";
import { useState } from "react";
import NewChildBountyPopup from "./newChildBountyPopup";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import Tooltip from "next-common/components/tooltip";
import { useContextApi } from "next-common/context/api";
import useSubStorage from "next-common/hooks/common/useSubStorage";

export default function NewChildBountyButton() {
  const address = useRealAddress();
  const [showPopup, setShowPopup] = useState(false);
  const onChain = useOnchainData();
  const api = useContextApi();

  const { bountyIndex } = onChain;

  // Get bounty status
  const { result: onchainBounty } = useSubStorage("bounties", "bounties", [
    bountyIndex,
  ]);
  const onchainBountyStatus = onchainBounty?.unwrap()?.status;

  // Get child bounty count
  const { result: onchainChildBountyCount } = useSubStorage(
    "childBounties",
    "parentChildBounties",
    [bountyIndex],
  );
  const childBountiesCount = onchainChildBountyCount?.toJSON();

  // New bounty button is only available when the bounty is active
  const isActive = onchainBountyStatus?.isActive;
  if (!isActive) {
    return null;
  }

  const curator = onchainBountyStatus.asActive.curator?.toString();

  let disabled = false;
  let disabledTooltip = "";

  const isCurator = curator === address;
  const maxActiveChildBountyCount =
    api?.consts.childBounties.maxActiveChildBountyCount.toNumber() ||
    Number.MAX_VALUE;

  if (!isCurator) {
    disabled = true;
    disabledTooltip = "Only curators can create a child bounty";
  } else if (childBountiesCount >= maxActiveChildBountyCount) {
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
