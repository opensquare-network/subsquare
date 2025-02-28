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
import { getRealField } from "next-common/sima/actions/common";

export function useAvatarUnset(proxyAddress) {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const signMessage = useSignMessage();
  const signerAccount = useSignerAccount();

  const unsetAvatar = useCallback(async () => {
    setIsLoading(true);
    try {
      const entity = {
        action: "unset-avatar",
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
        return false;
      }

      refreshAvatar(address);
      dispatch(newSuccessToast("Avatar removed successfully"));

      return true;
    } catch (e) {
      if (e.message !== "Cancelled") {
        dispatch(newErrorToast(e.message));
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [
    dispatch,
    signMessage,
    signerAccount?.address,
    signerAccount?.meta.source,
    proxyAddress,
  ]);

  return {
    isLoading,
    unsetAvatar,
  };
}

function Content() {
  const { onClose } = usePopupParams();
  const router = useRouter();
  const { isLoading, unsetAvatar } = useAvatarUnset();

  const onUnset = useCallback(async () => {
    const success = await unsetAvatar();
    if (success) {
      onClose();
      router.replace(router.asPath);
    }
  }, [unsetAvatar, onClose, router]);

  return (
    <>
      <Signer title="Signer" />
      <div className="flex justify-end">
        <LoadingPrimaryButton
          loading={isLoading}
          loadingText="Saving..."
          onClick={onUnset}
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
