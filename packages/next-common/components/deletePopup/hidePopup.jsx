import React, { useCallback, useState } from "react";
import Popup from "../popup/wrapper/Popup";
import { noop } from "lodash-es";
import DangerButton from "next-common/lib/button/danger";
import { PopupButtonWrapper } from "../popup/wrapper";
import SecondaryButton from "next-common/lib/button/secondary";
import { useEnsureLogin } from "next-common/hooks/useEnsureLogin";

export default function HidePopup({
  hidden = false,
  setShow = noop,
  doHide = noop,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const { ensureLogin } = useEnsureLogin();

  const handleHide = useCallback(async () => {
    setIsLoading(true);
    try {
      if (!(await ensureLogin())) {
        return;
      }
      await doHide();
      setShow(false);
    } finally {
      setIsLoading(false);
    }
  }, [doHide, setShow, ensureLogin]);

  return (
    <Popup
      title={hidden ? "Unhide Post" : "Hide Post"}
      onClose={() => setShow(false)}
    >
      <div className="text-[14px] text-textPrimary">
        {hidden
          ? "This post will be visible to everyone again."
          : "This post will be hidden from the list. You can unhide it later."}
      </div>
      <PopupButtonWrapper className="gap-[8px]">
        <SecondaryButton onClick={() => setShow(false)}>Cancel</SecondaryButton>
        <DangerButton loading={isLoading} onClick={handleHide}>
          {hidden ? "Unhide" : "Hide"}
        </DangerButton>
      </PopupButtonWrapper>
    </Popup>
  );
}
