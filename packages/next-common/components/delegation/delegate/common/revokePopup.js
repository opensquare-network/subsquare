import React from "react";
import PopupWithSigner from "next-common/components/popupWithSigner";
import PrimaryButton from "next-common/lib/button/primary";
import {
  Referenda,
  useModuleTab,
} from "next-common/components/profile/votingHistory/common";
import { useSignMessage } from "next-common/hooks/useSignMessage";
import nextApi from "next-common/services/nextApi";
import { setDemocracyDelegatesTriggerUpdate } from "next-common/store/reducers/democracy/delegates";
import { setReferendaDelegatesTriggerUpdate } from "next-common/store/reducers/referenda/delegates";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import {
  usePopupParams,
  useSignerAccount,
} from "next-common/components/popupWithSigner/context";
import SignerWithBalance from "next-common/components/signerPopup/signerWithBalance";
import { PopupButtonWrapper } from "next-common/components/popup/wrapper";

function PopupContent({ children }) {
  const { address, onClose } = usePopupParams();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const signMessage = useSignMessage();
  const tab = useModuleTab();
  const module = tab === Referenda ? "referenda" : "democracy";
  const signerAccount = useSignerAccount();

  const triggerUpdate = useCallback(() => {
    if (module === "referenda") {
      dispatch(setReferendaDelegatesTriggerUpdate());
    } else if (module === "democracy") {
      dispatch(setDemocracyDelegatesTriggerUpdate());
    }
  }, [dispatch, module]);

  const revokeAnnouncement = useCallback(async () => {
    try {
      setIsLoading(true);

      const entity = {
        action: "unset-delegation-announcement",
        timestamp: Date.now(),
      };
      const signerWallet = signerAccount.meta.source;
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
      const { error } = await nextApi.post(
        "delegation/announcements/unset",
        data,
      );
      if (error) {
        dispatch(newErrorToast(error.message));
        return;
      }
      triggerUpdate();
      onClose();
    } catch (e) {
      dispatch(newErrorToast(e.message));
    } finally {
      setIsLoading(false);
    }
  }, [dispatch, onClose, address, triggerUpdate, signerAccount, signMessage]);

  return (
    <>
      <SignerWithBalance />
      {children}
      <PopupButtonWrapper>
        <PrimaryButton loading={isLoading} onClick={revokeAnnouncement}>
          Confirm
        </PrimaryButton>
      </PopupButtonWrapper>
    </>
  );
}

export default function RevokePopup({ children, ...props }) {
  return (
    <PopupWithSigner {...props}>
      <PopupContent>{children}</PopupContent>
    </PopupWithSigner>
  );
}
