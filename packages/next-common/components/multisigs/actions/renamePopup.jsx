import React, { useCallback, useState } from "react";
import nextApi from "next-common/services/nextApi";
import {
  newErrorToast,
  newSuccessToast,
} from "next-common/store/reducers/toastSlice";
import { useDispatch } from "react-redux";
import PrimaryButton from "next-common/lib/button/primary";
import Popup from "next-common/components/popup/wrapper/Popup";
import TextInputField from "next-common/components/popup/fields/textInputField";
import { useMultisigAccounts } from "../context/multisigAccountsContext";
import {
  ERROR_MESSAGE,
  MultisigErrorMessage,
} from "next-common/components/createMultisig/styled";
import useRenameIsEqual from "next-common/components/createMultisig/hooks/useRenameIsEqual";
import { FieldTooltipTitle } from "next-common/components/styled/fieldTooltipTitle";
import { useConnectedAccount } from "next-common/context/connectedAccount";
import { getRealField } from "next-common/sima/actions/common";
import { useSignMessage } from "next-common/hooks/useSignMessage";
import useRealAddress from "next-common/utils/hooks/useRealAddress";

export default function RemovePopup({ onClose, multisig }) {
  const realAddress = useRealAddress();
  const connectedAccount = useConnectedAccount();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState();
  const { refresh } = useMultisigAccounts();
  const [name, setName] = useState(multisig.name || "");
  const isNameEqual = useRenameIsEqual(multisig.multisigAddress, name);
  const signMessage = useSignMessage();

  const doSubmit = useCallback(async () => {
    setIsLoading(true);
    try {
      if (!connectedAccount) {
        dispatch(newErrorToast("Please connect your account first"));
        return;
      }

      const entity = {
        action: "update-multisig",
        multisigAddress: multisig.multisigAddress,
        name,
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

      const { error } = await nextApi.patch(
        `users/${realAddress}/multisigs/${multisig.multisigAddress}`,
        data,
      );
      if (error) {
        dispatch(newErrorToast(error.message));
        return;
      }
      dispatch(newSuccessToast("Renamed successfully"));
      onClose();
      refresh?.();
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [
    dispatch,
    signMessage,
    connectedAccount,
    realAddress,
    multisig,
    name,
    onClose,
    refresh,
  ]);

  return (
    <Popup title="Rename Multisig Account" onClose={onClose}>
      <div>
        <TextInputField
          title={
            <FieldTooltipTitle
              title="Name"
              tooltip="Used as multisig account name if no identity set"
            />
          }
          text={name}
          setText={setName}
          placeholder="Please fill the name..."
        />
      </div>
      {isNameEqual && (
        <MultisigErrorMessage>{ERROR_MESSAGE.NAME_EXIST}</MultisigErrorMessage>
      )}
      <div className="flex justify-end">
        <PrimaryButton
          loading={isLoading}
          disabled={isLoading || !name || isNameEqual}
          onClick={doSubmit}
        >
          Save Changes
        </PrimaryButton>
      </div>
    </Popup>
  );
}
