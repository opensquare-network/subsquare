import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { useEnsureLogin } from "next-common/hooks/useEnsureLogin";
import { nextApi } from "next-common/services/nextApi";
import { newSuccessToast } from "next-common/store/reducers/toastSlice";

export default function useVerifyJudgementEmailCode({
  who,
  code,
  setError,
  onVerified,
}) {
  const dispatch = useDispatch();
  const { ensureLogin } = useEnsureLogin();
  const [verifying, setVerifying] = useState(false);

  const verifyCode = useCallback(async () => {
    setError?.("");
    if (!who) {
      setError?.("Unable to determine who");
      return;
    }

    if (!code) {
      setError?.("Code is required");
      return;
    }

    setVerifying(true);
    try {
      if (!(await ensureLogin())) {
        return;
      }

      const { error: verifyError } = await nextApi.post(
        "people/judgement/auth/email/verify-code",
        { who, code },
      );
      if (verifyError) {
        setError?.(verifyError.message || "Verification failed");
        return;
      }

      dispatch(newSuccessToast("Email verified"));
      onVerified?.();
    } finally {
      setVerifying(false);
    }
  }, [code, dispatch, ensureLogin, onVerified, setError, who]);

  return {
    verifying,
    verifyCode,
  };
}
