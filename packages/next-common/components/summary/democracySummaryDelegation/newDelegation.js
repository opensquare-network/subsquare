import React, { useState } from "react";
import { Button } from "../styled";
import DelegatePopup from "next-common/components/democracy/delegatePopup";
import MoonDelegatePopup from "next-common/components/democracy/delegatePopup/moonPopup";
import AddSVG from "next-common/assets/imgs/icons/add.svg";
import isMoonChain from "next-common/utils/isMoonChain";
import useIsUseMetamask from "next-common/hooks/useIsUseMetamask";

export default function DemocracyNewDelegation() {
  const [showDelegatePopup, setShowDelegatePopup] = useState(false);
  const isUseMetamask = useIsUseMetamask();

  let TheDelegatePopup = DelegatePopup;
  if (isMoonChain() && isUseMetamask) {
    TheDelegatePopup = MoonDelegatePopup;
  }

  return (
    <>
      <Button onClick={() => setShowDelegatePopup(true)}>
        <AddSVG />
        New Delegate
      </Button>
      {showDelegatePopup && (
        <TheDelegatePopup onClose={() => setShowDelegatePopup(false)} />
      )}
    </>
  );
}
