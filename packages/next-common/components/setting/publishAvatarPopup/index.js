import CheckSimaSpec from "next-common/components/checkSimaSpec";
import { useUploadToIpfs } from "next-common/hooks/useUploadToIpfs";
import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import {
  newErrorToast,
  newSuccessToast,
} from "next-common/store/reducers/toastSlice";
import nextApi from "next-common/services/nextApi";
import LoadingButton from "next-common/lib/button/loading";
import PrimaryButton from "next-common/lib/button/primary";
import { useSignMessage } from "next-common/hooks/useSignMessage";
import {
  usePopupParams,
  useSignerAccount,
} from "next-common/components/popupWithSigner/context";
import PopupWithSigner from "next-common/components/popupWithSigner";

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
      );
      if (uploadError) {
        dispatch(
          newErrorToast(
            "Failed to upload avatar to IPFS node: " + uploadError.message,
          ),
        );
        return;
      }
      const { cid } = uploadResult;

      const entity = {
        avatarCid: cid,
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
  }, [dispatch, onClose, imageFile, router, upload, signMessage]);

  return (
    <>
      <CheckSimaSpec />
      <div className="flex justify-end">
        {isLoading ? (
          <LoadingButton>
            {uploading ? "Saving..." : "Publishing..."}
          </LoadingButton>
        ) : (
          <PrimaryButton onClick={submitAvatar}>Confirm</PrimaryButton>
        )}
      </div>
    </>
  );
}

export default function PublishAvatarPopup(props) {
  return (
    <PopupWithSigner title="Save & Publish" wide {...props}>
      <Content />
    </PopupWithSigner>
  );
}
