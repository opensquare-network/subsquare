import React from "react";
import { useState } from "react";
import { useEnsureLogin } from "next-common/hooks/useEnsureLogin";
import { useProposeCuratorPopup } from "./useProposeCurator";
import PrimaryButton from "next-common/lib/button/primary";

export default function ProposeCurator() {
  // const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { ensureLogin } = useEnsureLogin();

  // TODO: Null Guard.

  // TODO: disabled.
  const disabled = false;

  // TODO: call api in useProposeCuratorPopup

  const { showPopup, component: ProposeCuratorPopup } =
    useProposeCuratorPopup();

  return (
    <>
      <PrimaryButton className="w-full" onClick={() => showPopup()}>
        Propose Curator
      </PrimaryButton>
      {ProposeCuratorPopup}
    </>
  );
}
