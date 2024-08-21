import React, { useState } from "react";
import SecondaryButton from "next-common/lib/button/secondary";
import { SystemPlus } from "@osn/icons/subsquare";
import dynamicPopup from "next-common/lib/dynamic/popup";

const DelegatePopup = dynamicPopup(() =>
  import("next-common/components/democracy/delegatePopup"),
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
        <DelegatePopup
          defaultTargetAddress={defaultTargetAddress}
          targetDisabled={targetDisabled}
          onClose={() => setShowDelegatePopup(false)}
        />
      )}
    </>
  );
}
