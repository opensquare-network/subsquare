import React, { useCallback, useState } from "react";
import nextApi from "next-common/services/nextApi";
import {
  newErrorToast,
  newSuccessToast,
} from "next-common/store/reducers/toastSlice";
import { useDispatch } from "react-redux";
import SecondaryButton from "next-common/lib/button/secondary";
import PrimaryButton from "next-common/lib/button/primary";
import Popup from "next-common/components/popup/wrapper/Popup";
import { useMultisigAccounts } from "../context/multisigAccountsContext";
import { getRealField } from "next-common/sima/actions/common";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useConnectedAccount } from "next-common/context/connectedAccount";
import { useSignMessage } from "next-common/hooks/useSignMessage";

export default function RemovePopup({ onClose, multisigAddress }) {
  const realAddress = useRealAddress();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState();
  const { refresh } = useMultisigAccounts();
  const connectedAccount = useConnectedAccount();
  const signMessage = useSignMessage();

  const doSubmit = useCallback(async () => {
    setIsLoading(true);

    try {
      if (!connectedAccount) {
        dispatch(newErrorToast("Please connect your account first"));
        return;
      }

      const entity = {
        action: "remove-multisig",
        multisigAddress,
        timestamp: Date.now(),
        real: getRealField(realAddress),
      };
      const signature = await signMessage(
        JSON.stringify(entity),
        connectedAccount.address,
        connectedAccount.wallet,
      );
      const data = {
        entity,
        address: connectedAccount.address,
        signature,
        signerWallet: connectedAccount.wallet,
      };

      const { error } = await nextApi.post(
        `users/${realAddress}/multisigs/${multisigAddress}/delete`,
        data,
      );
      if (error) {
        dispatch(newErrorToast(error.message));
        return;
      }
      dispatch(newSuccessToast("Removed successfully"));
      onClose();
      refresh?.();
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [
    connectedAccount,
    realAddress,
    signMessage,
    dispatch,
    multisigAddress,
    onClose,
    refresh,
  ]);

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
          disabled={isLoading}
          className="!bg-red500"
          onClick={doSubmit}
        >
          Confirm
        </PrimaryButton>
      </div>
    </Popup>
  );
}
