import { useState } from "react";
import dynamicPopup from "next-common/lib/dynamic/popup";

const PoolWithdrawUnbondedPopup = dynamicPopup(() =>
  import(
    "next-common/components/staking/overview/accountStaking/withdrawUnbondedPopup"
  ),
);

export default function PoolWithdrawUnbondedButton({ poolId }) {
  const [showWithdrawUnbondedPopup, setShowWithdrawUnbondedPopup] =
    useState(false);

  return (
    <>
      <div
        role="button"
        className="text-theme500 text12Medium cursor-pointer mb-1"
        onClick={() => setShowWithdrawUnbondedPopup(true)}
      >
        Withdraw
      </div>
      {showWithdrawUnbondedPopup && (
        <PoolWithdrawUnbondedPopup
          poolId={poolId}
          onClose={() => setShowWithdrawUnbondedPopup(false)}
        />
      )}
    </>
  );
}
