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
      let { error, result } = await upload(imageFile);
      if (error) {
        dispatch(
          newErrorToast("Failed to save avatar to IPFS: " + error.message),
        );
        return;
      }
      const { cid } = result;

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

      ({ error } = await nextApi.post("user/avatar", data));
      if (error) {
        dispatch(
          newErrorToast("Failed to update user avatar: " + error.message),
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
