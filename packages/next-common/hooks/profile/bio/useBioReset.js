import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import {
  newErrorToast,
  newSuccessToast,
} from "next-common/store/reducers/toastSlice";
import nextApi from "next-common/services/nextApi";
import { useSignMessage } from "next-common/hooks/useSignMessage";
import { useSignerAccount } from "next-common/components/popupWithSigner/context";
import { getRealField } from "next-common/sima/actions/common";

export default function useBioReset(proxyAddress) {
  const dispatch = useDispatch();
  const [isResetting, setIsUnsetting] = useState(false);
  const signMessage = useSignMessage();
  const signerAccount = useSignerAccount();

  const reset = useCallback(async () => {
    setIsUnsetting(true);
    try {
      const entity = {
        action: "unset-profile-bio",
        timestamp: Date.now(),
        real: getRealField(proxyAddress),
      };
      const address = signerAccount?.address;
      const signerWallet = signerAccount?.meta.source;
      const signature = await signMessage(
        JSON.stringify(entity),
        address,
        signerWallet,
      );
      const data = {
        entity,
        address,
        signature,
        signerWallet,
      };

      const { error: resetUserBioError } = await nextApi.post(
        "user/bio/unset",
        data,
      );

      if (resetUserBioError) {
        dispatch(
          newErrorToast(
            "Failed to reset user's bio: " + resetUserBioError.message,
          ),
        );
        throw new Error(resetUserBioError.message);
      }

      dispatch(newSuccessToast("Reset bio successfully"));
    } catch (e) {
      if (e.message !== "Cancelled") {
        dispatch(newErrorToast(e.message));
      }
      throw e;
    } finally {
      setIsUnsetting(false);
    }
  }, [
    proxyAddress,
    signerAccount?.address,
    signerAccount?.meta.source,
    signMessage,
    dispatch,
  ]);

  return {
    isResetting,
    reset,
  };
}
