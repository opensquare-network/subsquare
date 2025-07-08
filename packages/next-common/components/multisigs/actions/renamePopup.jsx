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
import { useRouter } from "next/router";
import TextInputField from "next-common/components/popup/fields/textInputField";
export default function RemovePopup({ onClose, multisig }) {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState();
  const { ensureLogin } = useEnsureLogin();
  const router = useRouter();
  const [name, setName] = useState(multisig.name);

  const doSubmit = useCallback(async () => {
    setIsLoading(true);
    try {
      await ensureLogin();
      const { error } = await nextApi.post("user/multisigs", {
        ...multisig,
        name,
      });
      if (error) {
        dispatch(newErrorToast(error.message));
        return;
      }
      dispatch(newSuccessToast("Rename multisig account successfully"));
      onClose();
      router.replace(router.asPath);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [dispatch, ensureLogin, multisig, name, onClose, router]);

  return (
    <Popup title="Rename Multisig Account" onClose={onClose}>
      <div>
        <TextInputField
          title="Name"
          text={name}
          setText={setName}
          placeholder="Please fill the name..."
        />
      </div>
      <div className="flex justify-end">
        <PrimaryButton loading={isLoading} onClick={doSubmit}>
          Save Changes
        </PrimaryButton>
      </div>
    </Popup>
  );
}
