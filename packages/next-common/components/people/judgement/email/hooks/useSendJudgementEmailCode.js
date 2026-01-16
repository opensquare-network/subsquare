import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { useEnsureLogin } from "next-common/hooks/useEnsureLogin";
import { nextApi } from "next-common/services/nextApi";
import {
  newErrorToast,
  newSuccessToast,
} from "next-common/store/reducers/toastSlice";

export default function useSendJudgementEmailCode({ who, setError, onSent }) {
  const dispatch = useDispatch();
  const { ensureLogin } = useEnsureLogin();
  const [sending, setSending] = useState(false);

  const sendCode = useCallback(async () => {
    setError?.("");
    if (!who) {
      setError?.("Unable to determine who");
      return;
    }

    setSending(true);
    try {
      if (!(await ensureLogin())) {
        return;
      }

      const { error: sendError } = await nextApi.post(
        "people/judgement/auth/email/send-code",
        { who },
      );
      if (sendError) {
        const message = sendError.message || "Failed to send code";
        setError?.(message);
        dispatch(newErrorToast(message));
        return;
      }

      onSent?.();
      dispatch(newSuccessToast("Verification code sent"));
    } finally {
      setSending(false);
    }
  }, [dispatch, ensureLogin, onSent, setError, who]);

  return {
    sending,
    sendCode,
  };
}
