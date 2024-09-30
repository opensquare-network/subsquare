import React, { useState } from "react";
import { useProposeCuratorPopup } from "./useProposeCurator";
import PrimaryButton from "next-common/lib/button/primary";
import { usePostState } from "next-common/context/post";

export default function ProposeCurator() {
  const [isProposeDisabled, setIsProposeDisabled] = useState(true);
  const chainState = usePostState();
  const { showPopup, component: ProposeCuratorPopup } =
    useProposeCuratorPopup();

  if (chainState !== "Add") {
    return null;
  }

  return (
    <>
      <PrimaryButton
        className="w-full"
        onClick={() => showPopup()}
        disabled={isProposeDisabled}
      >
        Propose Curator
      </PrimaryButton>
      {ProposeCuratorPopup}
    </>
  );
}
