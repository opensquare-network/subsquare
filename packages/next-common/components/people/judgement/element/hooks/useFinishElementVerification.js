import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { nextApi } from "next-common/services/nextApi";
import { newErrorToast } from "next-common/store/reducers/toastSlice";

export default function useFinishElementVerification({
  who,
  setError,
  onVerified,
}) {
  const dispatch = useDispatch();
  const [verifying, setVerifying] = useState(false);

  const verify = useCallback(async () => {
    setError?.("");
    if (!who) {
      setError?.("Unable to determine who");
      return;
    }

    setVerifying(true);
    try {
      const { result, error: startError } = await nextApi.fetch(
        `people/identities/${who}/active-request`,
      );
      if (startError) {
        const message = startError.message || "Failed to start verification";
        setError?.(message);
        dispatch(newErrorToast(message));
        return;
      }

      const request = result || null;

      const isElementVerified = request?.verifications.element === true;
      if (isElementVerified) {
        onVerified?.();
      } else {
        const message =
          "Element verification is not passed yet, please check your Element app.";
        // setError?.(message);
        dispatch(newErrorToast(message));
      }
    } finally {
      setVerifying(false);
    }
  }, [dispatch, onVerified, setError, who]);

  return {
    verifying,
    verify,
  };
}
