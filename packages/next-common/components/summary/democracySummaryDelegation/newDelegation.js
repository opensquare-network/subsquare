import React, { useState } from "react";
import SecondaryButton from "next-common/lib/button/secondary";
import { SystemPlus } from "@osn/icons/subsquare";
import isMoonChain from "next-common/utils/isMoonChain";
import useIsUseMetamask from "next-common/hooks/useIsUseMetamask";
import dynamicPopup from "next-common/lib/dynamic/popup";

const DelegatePopup = dynamicPopup(() =>
  import("next-common/components/democracy/delegatePopup"),
);

const MoonDelegatePopup = dynamicPopup(() =>
  import("next-common/components/democracy/delegatePopup/moonPopup"),
);

/**
 * @param {{
 * defaultTargetAddress?: string
 * targetDisabled?: boolean
 * } & ButtonProps} props
 */
export default function DemocracyNewDelegation({
  defaultTargetAddress,
  targetDisabled,
  disabled,
  size = "small",
  ...props
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
        size={size}
        iconLeft={<SystemPlus className="w-4 h-4" />}
        {...props}
        onClick={() => {
          setShowDelegatePopup(true);
        }}
      >
        {props.children || "Delegate"}
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
