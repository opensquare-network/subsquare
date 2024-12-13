// import CheckSimaSpec from "next-common/components/checkSimaSpec";
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
  const { onClose } = usePopupParams();
  const dispatch = useDispatch();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const signMessage = useSignMessage();
  const signerAccount = useSignerAccount();

  const unsetAvatar = useCallback(async () => {
    setIsLoading(true);
    try {
      const entity = {
        action: "unset-avatar",
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

      const { error: unsetUserAvatarError } = await nextApi.post(
        "user/avatar/unset",
        data,
      );
      if (unsetUserAvatarError) {
        dispatch(
          newErrorToast(
            "Failed to remove user's avatar: " + unsetUserAvatarError.message,
          ),
        );
        return;
      }

      refreshAvatar(address);
      dispatch(newSuccessToast("Avatar removed successfully"));

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
    dispatch,
    onClose,
    router,
    signMessage,
    signerAccount?.address,
    signerAccount?.meta.source,
  ]);

  return (
    <>
      <Signer title="Signer" />
      <div className="flex justify-end">
        <LoadingPrimaryButton
          loading={isLoading}
          loadingText="Saving..."
          onClick={unsetAvatar}
        >
          Confirm
        </LoadingPrimaryButton>
      </div>
    </>
  );
}

export default function UnsetAvatarPopup(props) {
  return (
    <PopupWithSigner title="Unset" {...props}>
      <Content />
    </PopupWithSigner>
  );
}
