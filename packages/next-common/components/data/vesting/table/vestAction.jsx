import { useCallback } from "react";
import { SystemUnlock } from "@osn/icons/subsquare";
import { cn } from "next-common/utils";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useVestPopup } from "next-common/components/data/vesting/context/vestPopupContext";
import Tooltip from "next-common/components/tooltip";

function VestActionImpl({ account, unlockable }) {
  const { showVestPopup } = useVestPopup();
  const hasUnlockable = unlockable && BigInt(unlockable) > 0n;

  const handleClick = useCallback(() => {
    if (!hasUnlockable) {
      return;
    }

    showVestPopup(account, unlockable);
  }, [hasUnlockable, showVestPopup, account, unlockable]);

  return (
    <Tooltip content={!hasUnlockable ? "No unlockable balance" : "Vest"}>
      <div
        role="button"
        onClick={handleClick}
        className={cn(
          "inline-flex items-center justify-center px-1.5 py-1.5 rounded border",
          !hasUnlockable
            ? "border-neutral300 cursor-not-allowed"
            : "border-neutral400 cursor-pointer",
        )}
      >
        <SystemUnlock
          className={cn("w-4 h-4 text-textSecondary", !hasUnlockable && "text-textDisabled")}
        />
      </div>
    </Tooltip>
  );
}

export default function VestAction({ account, unlockable }) {
  const realAddress = useRealAddress();
  if (!realAddress) {
    return null;
  }

  return <VestActionImpl account={account} unlockable={unlockable} />;
}
