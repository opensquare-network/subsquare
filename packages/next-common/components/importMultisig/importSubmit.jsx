import { useCallback, useState } from "react";
import TextInputField from "../popup/fields/textInputField";
import { Label } from "../popup/styled";
import PrimaryButton from "next-common/lib/button/primary";
import SecondaryButton from "next-common/lib/button/secondary";
import { ArrowLineLeft } from "@osn/icons/subsquare";
import MultisigDisplay from "./multisigDisplay";
import { backendApi } from "next-common/services/nextApi";
import { useDispatch } from "react-redux";
import {
  newErrorToast,
  newSuccessToast,
} from "next-common/store/reducers/toastSlice";
import { noop } from "lodash-es";
import { useMultisigAccounts } from "../multisigs/context/multisigAccountsContext";
import { FieldTooltipTitle } from "../styled/fieldTooltipTitle";
import useNameIsEqual from "../createMultisig/hooks/useNameIsEqual";
import { ERROR_MESSAGE, MultisigErrorMessage } from "../createMultisig/styled";
import { getRealField } from "next-common/sima/actions/common";
import { useConnectedAccount } from "next-common/context/connectedAccount";
import { useSignMessage } from "next-common/hooks/useSignMessage";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useUser } from "next-common/context/user";

export default function ImportSubmit({
  selectedMultisig,
  onBack = noop,
  onClose = noop,
}) {
  const user = useUser();
  const realAddress = useRealAddress();
  const dispatch = useDispatch();
  const [name, setName] = useState(selectedMultisig.name || "");
  const [isLoading, setIsLoading] = useState(false);
  const isNameEqual = useNameIsEqual(name);

  const { refresh } = useMultisigAccounts();
  const connectedAccount = useConnectedAccount();
  const signMessage = useSignMessage();

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsLoading(true);
      try {
        if (!connectedAccount) {
          dispatch(newErrorToast("Please connect your account first"));
          return;
        }

        const entity = {
          action: "add-multisig",
          ...selectedMultisig,
          name,
          timestamp: Date.now(),
          real: getRealField(user?.proxyAddress),
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
        const { error } = await backendApi.post(
          `users/${realAddress}/multisigs`,
          data,
        );

        if (error) {
          throw new Error(error.message);
        }
        dispatch(newSuccessToast("Multisig imported successfully"));
        onClose?.();
        refresh?.();
      } catch (error) {
        dispatch(newErrorToast(error.message));
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    },
    [
      realAddress,
      user?.proxyAddress,
      signMessage,
      connectedAccount,
      selectedMultisig,
      name,
      dispatch,
      onClose,
      refresh,
    ],
  );

  if (!selectedMultisig) {
    return null;
  }

  return (
    <form className="flex flex-col gap-y-4" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-y-2">
        <Label>Multisig</Label>
        <MultisigDisplay
          className="cursor-default bg-neutral200 border-none"
          multisig={selectedMultisig}
        />
      </div>

      <TextInputField
        title={
          <FieldTooltipTitle
            title="Name"
            tooltip="Used as multisig account name if no identity set"
          />
        }
        text={name}
        setText={setName}
        placeholder="Please set a name..."
      />
      {isNameEqual && (
        <MultisigErrorMessage>{ERROR_MESSAGE.NAME_EXIST}</MultisigErrorMessage>
      )}

      <div className="flex items-center justify-between">
        <SecondaryButton
          disabled={isLoading}
          onClick={onBack}
          className="gap-x-1"
        >
          <ArrowLineLeft /> Previous
        </SecondaryButton>
        <PrimaryButton
          disabled={!name || isLoading}
          type="submit"
          loading={isLoading}
        >
          Import
        </PrimaryButton>
      </div>
    </form>
  );
}
