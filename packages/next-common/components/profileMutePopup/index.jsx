import { useCallback, useState } from "react";
import { noop } from "lodash-es";
import Popup from "next-common/components/popup/wrapper/Popup";
import { PopupButtonWrapper } from "next-common/components/popup/wrapper";
import SecondaryButton from "next-common/lib/button/secondary";
import DangerButton from "next-common/lib/button/danger";
import PrimaryButton from "next-common/lib/button/primary";

export default function ProfileMutePopup({
  muted = false,
  onClose = noop,
  onConfirm = noop,
}) {
  const [isLoading, setIsLoading] = useState(false);

  const confirm = useCallback(async () => {
    setIsLoading(true);
    try {
      const success = await onConfirm();
      if (success) {
        onClose();
      }
    } finally {
      setIsLoading(false);
    }
  }, [onConfirm, onClose]);

  return (
    <Popup title={muted ? "Unmute Address" : "Mute Address"} onClose={onClose}>
      <div className="text-[14px] text-textPrimary">
        {muted
          ? "This address will be able to create and edit content again."
          : "This address will be muted and cannot create or edit discussions, comments, or onchain proposals."}
      </div>
      <PopupButtonWrapper className="gap-[8px]">
        <SecondaryButton disabled={isLoading} onClick={onClose}>
          Cancel
        </SecondaryButton>
        {muted ? (
          <PrimaryButton loading={isLoading} onClick={confirm}>
            Confirm
          </PrimaryButton>
        ) : (
          <DangerButton loading={isLoading} onClick={confirm}>
            Confirm
          </DangerButton>
        )}
      </PopupButtonWrapper>
    </Popup>
  );
}
