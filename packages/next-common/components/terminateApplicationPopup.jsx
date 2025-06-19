import React, { useCallback, useState } from "react";
import nextApi from "next-common/services/nextApi";
import {
  newErrorToast,
  newSuccessToast,
} from "next-common/store/reducers/toastSlice";
import { useDispatch } from "react-redux";
import SecondaryButton from "next-common/lib/button/secondary";
import PrimaryButton from "next-common/lib/button/primary";
import { usePost } from "next-common/context/post";
import { useEnsureLogin } from "next-common/hooks/useEnsureLogin";
import Popup from "./popup/wrapper/Popup";
import { useRouter } from "next/router";

export const finalStateMap = {
  Rejected: "rejected",
  Invalid: "invalid",
  Timeout: "timedOut",
};

const terminateApplicationInfo = {
  [finalStateMap.Rejected]: {
    title: "Reject Application",
    confirmText:
      "This will reject the application, and you will not be able to reverse this decision.",
  },
  [finalStateMap.Invalid]: {
    title: "Invalidate Application",
    confirmText:
      "This will invalidate the application. You will not be able to restore it.",
  },
  [finalStateMap.Timeout]: {
    title: "Time Out Application",
    confirmText:
      "This will time out the application. You will not be able to reopen it.",
  },
};

export default function TerminateApplicationPopup({ onClose, finalState }) {
  const post = usePost();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState();
  const { ensureLogin } = useEnsureLogin();
  const router = useRouter();

  const terminateInfo = terminateApplicationInfo[finalState];

  const doSubmit = useCallback(async () => {
    setIsLoading(true);
    try {
      await ensureLogin();
      const { error } = await nextApi.post(
        `fellowship/applications/${post?.applicationUid}/terminate`,
        {
          finalState,
        },
      );
      if (error) {
        dispatch(newErrorToast(error.message));
        return;
      }
      dispatch(newSuccessToast("Terminate application successfully"));
      onClose();
      router.replace(router.asPath);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [
    dispatch,
    ensureLogin,
    finalState,
    onClose,
    post?.applicationUid,
    router,
  ]);

  if (!terminateInfo) {
    return null;
  }

  return (
    <Popup title={terminateInfo.title} onClose={onClose}>
      <div>
        <span className="text14Medium text-textPrimary">
          {terminateInfo.confirmText}
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
