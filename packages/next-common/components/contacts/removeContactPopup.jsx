import React, { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import Popup from "next-common/components/popup/wrapper/Popup";
import SecondaryButton from "next-common/lib/button/secondary";
import SubmitButton from "next-common/components/common/tx/submitButton";
import nextApi from "next-common/services/nextApi";
import {
  newErrorToast,
  newSuccessToast,
} from "next-common/store/reducers/toastSlice";
import { useEnsureLogin } from "next-common/hooks/useEnsureLogin";
import { useContactsContext } from "./context/contactsContext";

export default function RemoveContactPopup({ contact, onClose }) {
  const dispatch = useDispatch();
  const { refresh } = useContactsContext();
  const { ensureLogin } = useEnsureLogin();
  const [isLoading, setIsLoading] = useState(false);

  const doSubmit = useCallback(async () => {
    try {
      setIsLoading(true);

      if (!(await ensureLogin())) {
        return;
      }

      const { error } = await nextApi.delete(
        `user/contacts/${contact.address}`,
      );
      if (error) {
        dispatch(newErrorToast(error.message));
        return;
      }

      dispatch(newSuccessToast("Removed successfully"));
      onClose();
      refresh?.();
    } catch (e) {
      dispatch(newErrorToast(e.message));
    } finally {
      setIsLoading(false);
    }
  }, [ensureLogin, dispatch, contact, onClose, refresh]);

  return (
    <Popup title="Remove Contact" onClose={onClose}>
      <div className="text14Medium text-textPrimary">
        {`Are you sure you want to remove "${contact.name}" from your contacts?`}
      </div>
      <div className="flex gap-[8px] justify-end">
        <SecondaryButton onClick={onClose}>Cancel</SecondaryButton>
        <SubmitButton
          loading={isLoading}
          disabled={isLoading}
          className="!bg-red500"
          onClick={doSubmit}
        >
          Confirm
        </SubmitButton>
      </div>
    </Popup>
  );
}
