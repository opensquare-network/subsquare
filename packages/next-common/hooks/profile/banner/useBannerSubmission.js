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
import { useUploadToIpfs } from "next-common/hooks/useUploadToIpfs";

export default function useBannerSubmission(imageFile, proxyAddress) {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const signMessage = useSignMessage();
  const signerAccount = useSignerAccount();
  const { uploading, upload } = useUploadToIpfs();

  const setBanner = useCallback(async () => {
    setIsLoading(true);
    try {
      const { error: uploadError, result: uploadResult } = await upload(
        imageFile,
        {
          errorMessage: "Failed to upload image to IPFS",
        },
      );
      if (uploadError) {
        throw new Error(uploadError.message);
      }
      const { cid } = uploadResult;

      const entity = {
        action: "set-profile-banner",
        timestamp: Date.now(),
        real: getRealField(proxyAddress),
        CID: cid,
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

      const { error: setUserBannerError } = await nextApi.post(
        "user/banner",
        data,
      );

      if (setUserBannerError) {
        dispatch(
          newErrorToast(
            "Failed to set user's banner: " + setUserBannerError.message,
          ),
        );
        throw new Error(setUserBannerError.message);
      }

      dispatch(newSuccessToast("Set banner successfully"));
    } catch (e) {
      if (e.message !== "Cancelled") {
        dispatch(newErrorToast(e.message));
      }
      throw e;
    } finally {
      setIsLoading(false);
    }
  }, [
    upload,
    imageFile,
    proxyAddress,
    signerAccount?.address,
    signerAccount?.meta.source,
    signMessage,
    dispatch,
  ]);

  return {
    uploading,
    isLoading,
    setBanner,
  };
}
