import React, { useCallback, useState } from "react";
import nextApi from "next-common/services/nextApi";
import {
  newErrorToast,
  newSuccessToast,
} from "next-common/store/reducers/toastSlice";
import { useDispatch } from "react-redux";
import SecondaryButton from "next-common/lib/button/secondary";
import PrimaryButton from "next-common/lib/button/primary";
import { useEnsureLogin } from "next-common/hooks/useEnsureLogin";
import Popup from "next-common/components/popup/wrapper/Popup";
import { useRouter } from "next/router";
export default function RemovePopup({ onClose, multisigAddress }) {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState();
  const { ensureLogin } = useEnsureLogin();
  const router = useRouter();

  const doSubmit = useCallback(async () => {
    setIsLoading(true);
    try {
      await ensureLogin();
      const { error } = await nextApi.delete(
        `user/multisigs/${multisigAddress}`,
      );
      if (error) {
        dispatch(newErrorToast(error.message));
        return;
      }
      dispatch(newSuccessToast("Remove multisig account successfully"));
      onClose();
      router.replace(router.asPath);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [dispatch, ensureLogin, multisigAddress, onClose, router]);

  return (
    <Popup title="Remove Multisig Account" onClose={onClose}>
      <div>
        <span className="text14Medium text-textPrimary">
          This will remove the account from the list, but will not delete the
          multisig account and you can still import it again.
        </span>
      </div>
      <div className="flex gap-[8px] justify-end">
        <SecondaryButton onClick={onClose}>Cancel</SecondaryButton>
        <PrimaryButton
          loading={isLoading}
          className="!bg-red500"
          onClick={doSubmit}
        >
          Confirm
        </PrimaryButton>
      </div>
    </Popup>
  );
}
