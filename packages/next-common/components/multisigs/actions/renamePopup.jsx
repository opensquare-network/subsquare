import React, { useCallback, useState } from "react";
import nextApi from "next-common/services/nextApi";
import {
  newErrorToast,
  newSuccessToast,
} from "next-common/store/reducers/toastSlice";
import { useDispatch } from "react-redux";
import PrimaryButton from "next-common/lib/button/primary";
import { useEnsureLogin } from "next-common/hooks/useEnsureLogin";
import Popup from "next-common/components/popup/wrapper/Popup";
import TextInputField from "next-common/components/popup/fields/textInputField";
import { useMultisigAccounts } from "../context/accountsContext";
import {
  ERROR_MESSAGE,
  MultisigErrorMessage,
} from "next-common/components/createMultisig/styled";
import useRenameIsEqual from "next-common/components/createMultisig/hooks/useRenameIsEqual";
import { FieldTooltipTitle } from "next-common/components/styled/fieldTooltipTitle";

export default function RemovePopup({ onClose, multisig }) {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState();
  const { ensureLogin } = useEnsureLogin();
  const { refresh } = useMultisigAccounts();
  const [name, setName] = useState(multisig.name || "");
  const isNameEqual = useRenameIsEqual(multisig.multisigAddress, name);

  const doSubmit = useCallback(async () => {
    setIsLoading(true);
    try {
      await ensureLogin();
      const { error } = await nextApi.patch(
        `user/multisigs/${multisig.multisigAddress}`,
        {
          name,
        },
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
  }, [dispatch, ensureLogin, multisig, name, onClose, refresh]);

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
