// import CheckSimaSpec from "next-common/components/checkSimaSpec";
import { useUploadToIpfs } from "next-common/hooks/useUploadToIpfs";
import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import {
  newErrorToast,
  newSuccessToast,
} from "next-common/store/reducers/toastSlice";
import nextApi from "next-common/services/nextApi";
import { useSignMessage } from "next-common/hooks/useSignMessage";
import {
  usePopupParams,
  useSignerAccount,
} from "next-common/components/popupWithSigner/context";
import PopupWithSigner from "next-common/components/popupWithSigner";
import Signer from "next-common/components/popup/fields/signerField";
import LoadingPrimaryButton from "next-common/lib/button/loadingPrimary";
import { refreshAvatar } from "next-common/hooks/useAvatarInfo";

function Content() {
  const { imageFile, onClose } = usePopupParams();
  const dispatch = useDispatch();
  const router = useRouter();
  const { uploading, upload } = useUploadToIpfs();
  const [isLoading, setIsLoading] = useState(false);
  const signMessage = useSignMessage();
  const signerAccount = useSignerAccount();

  const submitAvatar = useCallback(async () => {
    setIsLoading(true);
    try {
      const { error: uploadError, result: uploadResult } = await upload(
        imageFile,
        {
          errorMessage: "Failed to upload image to IPFS",
        },
      );
      if (uploadError) {
        return;
      }
      const { cid } = uploadResult;

      const entity = {
        action: "set-avatar",
        CID: cid,
        timestamp: Date.now(),
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

      const { error: saveUserAvatarError } = await nextApi.post(
        "user/avatar",
        data,
      );
      if (saveUserAvatarError) {
        dispatch(
          newErrorToast(
            "Failed to save user's avatar cid: " + saveUserAvatarError.message,
          ),
        );
        return;
      }

      refreshAvatar(address);
      dispatch(newSuccessToast("Avatar updated successfully"));

      onClose();
      router.replace(router.asPath);
    } catch (e) {
      if (e.message === "Cancelled") {
        return;
      }
      dispatch(newErrorToast(e.message));
    } finally {
      setIsLoading(false);
    }
  }, [
    upload,
    imageFile,
    signerAccount?.address,
    signerAccount?.meta.source,
    signMessage,
    dispatch,
    onClose,
    router,
  ]);

  return (
    <>
      <Signer title="Signer" />
      {/* <CheckSimaSpec /> */}
      <div className="flex justify-end">
        <LoadingPrimaryButton
          loading={isLoading}
          loadingText={uploading ? "Uploading..." : "Saving..."}
          onClick={submitAvatar}
        >
          Confirm
        </LoadingPrimaryButton>
      </div>
    </>
  );
}

export default function PublishAvatarPopup(props) {
  return (
    <PopupWithSigner title="Upload & Save" {...props}>
      <Content />
    </PopupWithSigner>
  );
}
