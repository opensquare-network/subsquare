import { useCallback } from "react";
import { useVestPopup } from "next-common/components/data/vesting/context/vestPopupContext";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import Tooltip from "next-common/components/tooltip";

function VestButtonImpl({ account, unlockable }) {
  const { showVestPopup } = useVestPopup();
  const hasUnlockable = unlockable && BigInt(unlockable) > 0n;

  const handleClick = useCallback(() => {
    if (!hasUnlockable) {
      return;
    }

    showVestPopup(account, unlockable);
  }, [hasUnlockable, showVestPopup, account, unlockable]);

  return (
    <button
      onClick={handleClick}
      disabled={!hasUnlockable}
      className="text-theme500 text14Medium !ml-2 disabled:text-textDisabled disabled:cursor-not-allowed"
    >
      {!hasUnlockable ? (
        <Tooltip content="No unlockable balance">Vest</Tooltip>
      ) : (
        "Vest"
      )}
    </button>
  );
}

export default function VestButton({ account, unlockable }) {
  const realAddress = useRealAddress();
  if (!realAddress) {
    return null;
  }

  return <VestButtonImpl account={account} unlockable={unlockable} />;
}
