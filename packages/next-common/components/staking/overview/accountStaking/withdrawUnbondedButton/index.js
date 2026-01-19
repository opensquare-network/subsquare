import { useState } from "react";
import dynamicPopup from "next-common/lib/dynamic/popup";
import { cn } from "next-common/utils";

const PoolWithdrawUnbondedPopup = dynamicPopup(() =>
  import(
    "next-common/components/staking/overview/accountStaking/withdrawUnbondedPopup"
  ),
);

export default function PoolWithdrawUnbondedButton({ className }) {
  const [showWithdrawUnbondedPopup, setShowWithdrawUnbondedPopup] =
    useState(false);

  return (
    <>
      <div
        role="button"
        className={cn("text-theme500 cursor-pointer", className)}
        onClick={() => setShowWithdrawUnbondedPopup(true)}
      >
        Withdraw
      </div>
      {showWithdrawUnbondedPopup && (
        <PoolWithdrawUnbondedPopup
          onClose={() => setShowWithdrawUnbondedPopup(false)}
        />
      )}
    </>
  );
}
