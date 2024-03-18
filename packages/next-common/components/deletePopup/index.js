import React, { useCallback, useState } from "react";
import Popup from "../popup/wrapper/Popup";
import { noop } from "lodash-es";
import PrimaryButton from "next-common/lib/button/primary";
import { PopupButtonWrapper } from "../popup/wrapper";
import { useDispatch } from "react-redux";
import SecondaryButton from "next-common/lib/button/secondary";
import { useEnsureLogin } from "next-common/hooks/useEnsureLogin";

export default function DeletePopup({
  itemName = "item",
  setShow = noop,
  deletePost = noop,
}) {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const { ensureLogin } = useEnsureLogin();

  const doDelete = useCallback(async () => {
    setIsLoading(true);
    try {
      if (!(await ensureLogin())) {
        return;
      }
      await deletePost();
      setShow(false);
    } finally {
      setIsLoading(false);
    }
  }, [dispatch, ensureLogin, deletePost]);

  return (
    <Popup title="Delete" onClose={() => setShow(false)}>
      <div className="text-[14px] text-textPrimary">
        This will delete this {itemName} permanently. You will not be able to
        recover it.
      </div>
      <PopupButtonWrapper className="gap-[8px]">
        <SecondaryButton onClick={() => setShow(false)}>Cancel</SecondaryButton>
        <PrimaryButton
          className="!bg-red-500"
          isLoading={isLoading}
          onClick={doDelete}
        >
          Delete
        </PrimaryButton>
      </PopupButtonWrapper>
    </Popup>
  );
}
