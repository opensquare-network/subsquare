import { useCallback, useMemo, useState } from "react";
import PrimaryButton from "next-common/lib/button/primary";
import TextInputField from "../popup/fields/textInputField";
import { backendApi } from "next-common/services/nextApi";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import ThresholdField from "./fields/threshold";
import SignatoriesField from "./fields/signatories";
import { useSignatories } from "./context/signatories";
import { isEmpty, isNil } from "lodash-es";
import ImportTips from "./importTips";
import { useDispatch } from "react-redux";
import {
  newErrorToast,
  newSuccessToast,
} from "next-common/store/reducers/toastSlice";
import { usePopupParams } from "../popupWithSigner/context";
import useMulitisigSubmitError from "./hooks/useMulitisigSubmitError";
import { MultisigErrorMessage } from "./styled";
import { FieldTooltipTitle } from "../styled/fieldTooltipTitle";
import { useSignMessage } from "next-common/hooks/useSignMessage";
import { useConnectedAccount } from "next-common/context/connectedAccount";
import { getRealField } from "next-common/sima/actions/common";
import { useUser } from "next-common/context/user";

export default function CreateMultisigContent() {
  const user = useUser();
  const connectedAccount = useConnectedAccount();
  const realAddress = useRealAddress();
  const [threshold, setThreshold] = useState();
  const [name, setName] = useState("");
  const { signatories } = useSignatories();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const { onClose, onRefresh } = usePopupParams();
  const signMessage = useSignMessage();
  const submitSignatories = useMemo(
    () => [realAddress, ...signatories],
    [realAddress, signatories],
  );
  const { disabled: submitDisabled, error: multisigErrorMessage } =
    useMulitisigSubmitError(submitSignatories, threshold, name);

  const buttonDisabled = useMemo(() => {
    return (
      isNil(threshold) ||
      isEmpty(name) ||
      signatories.some((item) => isEmpty(item)) ||
      submitDisabled
    );
  }, [threshold, name, signatories, submitDisabled]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (!connectedAccount) {
        dispatch(newErrorToast("Please connect your account first"));
        return;
      }

      try {
        setIsLoading(true);

        const entity = {
          action: "add-multisig",
          signatories: submitSignatories,
          threshold,
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
        onRefresh?.();
        dispatch(newSuccessToast("Created successfully"));
        onClose?.();
      } catch (error) {
        dispatch(newErrorToast(error.message));
      } finally {
        setIsLoading(false);
      }
    },
    [
      realAddress,
      user?.proxyAddress,
      signMessage,
      dispatch,
      connectedAccount,
      submitSignatories,
      threshold,
      name,
      onRefresh,
      onClose,
    ],
  );

  return (
    <>
      <form onSubmit={handleSubmit} className="flex flex-col gap-y-4">
        <SignatoriesField />

        <ThresholdField
          signatories={signatories}
          onChange={setThreshold}
          value={threshold}
        />
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
        {multisigErrorMessage && (
          <MultisigErrorMessage>{multisigErrorMessage}</MultisigErrorMessage>
        )}
        <div className="flex justify-end">
          <PrimaryButton
            type="submit"
            disabled={buttonDisabled}
            loading={isLoading}
          >
            Submit
          </PrimaryButton>
        </div>
      </form>
      <ImportTips />
    </>
  );
}
