import { useCallback, useMemo, useState } from "react";
import PrimaryButton from "next-common/lib/button/primary";
import TextInputField from "../popup/fields/textInputField";
import nextApi from "next-common/services/nextApi";
import { useEnsureLogin } from "next-common/hooks/useEnsureLogin";
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
import { useMultisigAccounts } from "../multisigs/context/accountsContext";

export default function CreateMultisigContent() {
  const address = useRealAddress();
  const { ensureLogin } = useEnsureLogin();
  const [threshold, setThreshold] = useState();
  const [name, setName] = useState("");
  const { signatories } = useSignatories();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const { onClose } = usePopupParams();
  const { refresh } = useMultisigAccounts();

  const buttonDisabled = useMemo(() => {
    return (
      isNil(threshold) ||
      isEmpty(name) ||
      signatories.some((item) => isEmpty(item))
    );
  }, [threshold, name, signatories]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      try {
        setIsLoading(true);
        await ensureLogin();
        const { error } = await nextApi.post("user/multisigs", {
          signatories: [address, ...signatories],
          threshold,
          name,
        });
        if (error) {
          throw new Error(error.message);
        }
        onClose?.();
        dispatch(newSuccessToast("Created successfully"));
        refresh?.();
      } catch (error) {
        dispatch(newErrorToast(error.message));
      } finally {
        setIsLoading(false);
      }
    },
    [
      ensureLogin,
      address,
      signatories,
      threshold,
      name,
      onClose,
      dispatch,
      refresh,
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
          title="Name"
          text={name}
          setText={setName}
          placeholder="Please fill the name..."
        />
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
