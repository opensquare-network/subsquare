import React, { useState } from "react";
import SecondaryButton from "next-common/lib/button/secondary";
import DelegatePopup from "next-common/components/democracy/delegatePopup";
import MoonDelegatePopup from "next-common/components/democracy/delegatePopup/moonPopup";
import { SystemPlus } from "@osn/icons/subsquare";
import isMoonChain from "next-common/utils/isMoonChain";
import useIsUseMetamask from "next-common/hooks/useIsUseMetamask";

export default function DemocracyNewDelegation({
  defaultTargetAddress,
  targetDisabled,
  disabled,
}) {
  const [showDelegatePopup, setShowDelegatePopup] = useState(false);
  const isUseMetamask = useIsUseMetamask();

  let TheDelegatePopup = DelegatePopup;
  if (isMoonChain() && isUseMetamask) {
    TheDelegatePopup = MoonDelegatePopup;
  }

  return (
    <>
      <SecondaryButton
        disabled={disabled}
        size="small"
        iconLeft={<SystemPlus className="w-4 h-4" />}
        onClick={() => {
          setShowDelegatePopup(true);
        }}
      >
        Delegate
      </SecondaryButton>
      {showDelegatePopup && (
        <TheDelegatePopup
          defaultTargetAddress={defaultTargetAddress}
          targetDisabled={targetDisabled}
          onClose={() => setShowDelegatePopup(false)}
        />
      )}
    </>
  );
}
