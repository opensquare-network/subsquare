import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { useEnsureLogin } from "next-common/hooks/useEnsureLogin";
import { nextApi } from "next-common/services/nextApi";
import {
  newErrorToast,
  newSuccessToast,
} from "next-common/store/reducers/toastSlice";

export default function useStartElementVerification({
  who,
  setError,
  onStarted,
}) {
  const dispatch = useDispatch();
  const { ensureLogin } = useEnsureLogin();
  const [starting, setStarting] = useState(false);

  const startVerify = useCallback(async () => {
    setError?.("");
    if (!who) {
      setError?.("Unable to determine who");
      return;
    }

    setStarting(true);
    try {
      if (!(await ensureLogin())) {
        return;
      }

      const { result, error: startError } = await nextApi.post(
        "people/judgement/auth/element/start",
        { who },
      );
      if (startError) {
        const message = startError.message || "Failed to start verification";
        setError?.(message);
        dispatch(newErrorToast(message));
        return;
      }

      onStarted?.(result?.code);
      dispatch(newSuccessToast("Verification code sent"));
    } finally {
      setStarting(false);
    }
  }, [dispatch, ensureLogin, onStarted, setError, who]);

  return {
    starting,
    startVerify,
  };
}
