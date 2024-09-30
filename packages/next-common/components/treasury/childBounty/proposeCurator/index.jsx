import React from "react";
import { useProposeCuratorPopup } from "./useProposeCurator";
import PrimaryButton from "next-common/lib/button/primary";

export default function ProposeCurator() {
  // TODO: Null Guard.

  // TODO: disabled.
  const disabled = false;

  const { showPopup, component: ProposeCuratorPopup } =
    useProposeCuratorPopup();

  return (
    <>
      <PrimaryButton
        className="w-full"
        onClick={() => showPopup()}
        disabled={disabled}
      >
        Propose Curator
      </PrimaryButton>
      {ProposeCuratorPopup}
    </>
  );
}
