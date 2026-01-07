import { useState, useCallback } from "react";
import Popup from "../popup/wrapper/Popup";
import { PopupButtonWrapper } from "../popup/wrapper";
import SecondaryButton from "next-common/lib/button/secondary";
import PrimaryButton from "next-common/lib/button/primary";

export default function ConfirmRemoreAccountPopup({ onCancel, onConfirm }) {
  const [isLoading, setIsLoading] = useState(false);

  const _onConfirm = useCallback(async () => {
    setIsLoading(true);
    await onConfirm();
    setIsLoading(false);
  }, [onConfirm]);

  return (
    <Popup title="Confirm Remove Account" onClose={onCancel}>
      <div>
        <span className="text14Medium text-textPrimary">
          The address is connnected, if you remove it, will disconnect your
          current account!
        </span>
      </div>
      <PopupButtonWrapper className="space-x-2">
        <SecondaryButton onClick={onCancel}>Cancel</SecondaryButton>
        <PrimaryButton onClick={_onConfirm} loading={isLoading}>
          Confirm
        </PrimaryButton>
      </PopupButtonWrapper>
    </Popup>
  );
}
