import React, { useCallback, useState } from "react";
import Popup from "next-common/components/popup/wrapper/Popup";
import { noop } from "lodash-es";
import DangerButton from "next-common/lib/button/danger";
import { PopupButtonWrapper } from "next-common/components/popup/wrapper";
import SecondaryButton from "next-common/lib/button/secondary";

export default function MarkAsSpamPopup({ setShow = noop, onConfirm = noop }) {
  const [isLoading, setIsLoading] = useState(false);

  const doMarkAsSpam = useCallback(async () => {
    setIsLoading(true);
    try {
      await onConfirm();
      setShow(false);
    } finally {
      setIsLoading(false);
    }
  }, [onConfirm, setShow]);

  return (
    <Popup title="Mark as Spam" onClose={() => setShow(false)}>
      <div className="text-[14px] text-textPrimary">
        This comment will be marked as spam.
      </div>
      <PopupButtonWrapper className="gap-[8px]">
        <SecondaryButton onClick={() => setShow(false)}>Cancel</SecondaryButton>
        <DangerButton loading={isLoading} onClick={doMarkAsSpam}>
          Mark as Spam
        </DangerButton>
      </PopupButtonWrapper>
    </Popup>
  );
}
