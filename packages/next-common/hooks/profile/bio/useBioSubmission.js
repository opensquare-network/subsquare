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

export default function useBioSubmission(bio, proxyAddress) {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const signMessage = useSignMessage();
  const signerAccount = useSignerAccount();

  const setBio = useCallback(async () => {
    setIsLoading(true);
    try {
      const entity = {
        bio,
        action: "set-profile-bio",
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

      const { error: setUserBioError } = await nextApi.post("user/bio", data);

      if (setUserBioError) {
        dispatch(
          newErrorToast("Failed to set user's bio: " + setUserBioError.message),
        );
        throw new Error(setUserBioError.message);
      }

      dispatch(newSuccessToast("Set bio successfully"));
    } catch (e) {
      if (e.message !== "Cancelled") {
        dispatch(newErrorToast(e.message));
      }
      throw e;
    } finally {
      setIsLoading(false);
    }
  }, [
    proxyAddress,
    signerAccount?.address,
    signerAccount?.meta.source,
    signMessage,
    bio,
    dispatch,
  ]);

  return {
    isLoading,
    setBio,
  };
}
