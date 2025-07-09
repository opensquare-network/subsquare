import { useCallback, useState } from "react";
import TextInputField from "../popup/fields/textInputField";
import { Label } from "../popup/styled";
import PrimaryButton from "next-common/lib/button/primary";
import SecondaryButton from "next-common/lib/button/secondary";
import { ArrowLineLeft } from "@osn/icons/subsquare";
import MultisigDisplay from "./multisigDisplay";
import { useEnsureLogin } from "next-common/hooks/useEnsureLogin";
import nextApi from "next-common/services/nextApi";
import { useDispatch } from "react-redux";
import {
  newErrorToast,
  newSuccessToast,
} from "next-common/store/reducers/toastSlice";
import { noop } from "lodash-es";

export default function ImportSubmit({
  selectedMultisig,
  onBack = noop,
  onSuccessed = noop,
}) {
  const dispatch = useDispatch();
  const [name, setName] = useState(selectedMultisig.name);
  const [isLoading, setIsLoading] = useState(false);

  const { ensureLogin } = useEnsureLogin();

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsLoading(true);
      try {
        await ensureLogin();
        const { error, result } = await nextApi.post("user/multisigs", {
          ...selectedMultisig,
          name,
        });
        if (result?.success) {
          dispatch(newSuccessToast("Multisig imported successfully"));
          onSuccessed?.();
        }
        throw new Error(error.message);
      } catch (error) {
        dispatch(newErrorToast(error.message));
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    },
    [ensureLogin, selectedMultisig, name, dispatch, onSuccessed],
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
        title="Name"
        text={name}
        setText={setName}
        placeholder="Please set a name..."
      />

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
