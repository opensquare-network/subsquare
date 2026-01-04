import { useCallback } from "react";
import { SystemSignature } from "@osn/icons/subsquare";
import Tooltip from "next-common/components/tooltip";
import { cn } from "next-common/utils";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useVestPopup } from "../context/vestPopupContext";

function DoVestImpl({ account, unlockable }) {
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
        <SystemSignature
          className={cn("w-4 h-4", !hasUnlockable && "text-textDisabled")}
        />
      </div>
    </Tooltip>
  );
}

export default function DoVest({ account, unlockable }) {
  const realAddress = useRealAddress();
  if (!realAddress) {
    return null;
  }

  return <DoVestImpl account={account} unlockable={unlockable} />;
}
