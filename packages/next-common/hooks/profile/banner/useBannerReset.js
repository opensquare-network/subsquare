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

export default function useBannerReset(proxyAddress) {
  const dispatch = useDispatch();
  const [isResetting, setIsUnsetting] = useState(false);
  const signMessage = useSignMessage();
  const signerAccount = useSignerAccount();

  const reset = useCallback(async () => {
    setIsUnsetting(true);
    try {
      const entity = {
        action: "unset-profile-banner",
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

      const { error: resetUserBannerError } = await nextApi.post(
        "user/banner/unset",
        data,
      );

      if (resetUserBannerError) {
        dispatch(
          newErrorToast(
            "Failed to reset user's banner: " + resetUserBannerError.message,
          ),
        );
        throw new Error(resetUserBannerError.message);
      }

      dispatch(newSuccessToast("Reset banner successfully"));
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
