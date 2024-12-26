import React from "react";
import {
  Referenda,
  useModuleTab,
} from "next-common/components/profile/votingHistory/common";
import { useSignMessage } from "next-common/hooks/useSignMessage";
import nextApi from "next-common/services/nextApi";
import { setDemocracyDelegatesTriggerUpdate } from "next-common/store/reducers/democracy/delegates";
import { setReferendaDelegatesTriggerUpdate } from "next-common/store/reducers/referenda/delegates";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { getRealField } from "next-common/sima/actions/common";
import SignerPopup from "next-common/components/signerPopup";

export default function RevokePopup({ address, onClose }) {
  const dispatch = useDispatch();
  const signMessage = useSignMessage();
  const tab = useModuleTab();
  const module = tab === Referenda ? "referenda" : "democracy";

  const triggerUpdate = useCallback(() => {
    if (module === "referenda") {
      dispatch(setReferendaDelegatesTriggerUpdate());
    } else if (module === "democracy") {
      dispatch(setDemocracyDelegatesTriggerUpdate());
    }
  }, [dispatch, module]);

  const revokeAnnouncement = useCallback(
    async (signerAccount) => {
      try {
        const revokeByProxyAddress =
          signerAccount.proxyAddress && address === signerAccount.proxyAddress;

        const revokeBySignerAddress =
          !signerAccount.proxyAddress && address === signerAccount.address;

        if (!revokeByProxyAddress && !revokeBySignerAddress) {
          dispatch(
            newErrorToast(
              "Current origin doesn't match the owner of announcement",
            ),
          );
          return;
        }

        const entity = {
          action: "unset-delegation-announcement",
          timestamp: Date.now(),
          real: getRealField(signerAccount.proxyAddress),
        };
        const signerWallet = signerAccount.meta.source;
        const signature = await signMessage(
          JSON.stringify(entity),
          signerAccount.address,
          signerWallet,
        );

        const data = {
          entity,
          address: signerAccount.address,
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
      }
    },
    [dispatch, address, onClose, triggerUpdate, signMessage],
  );

  return (
    <SignerPopup
      title="Revoke"
      onClose={onClose}
      actionCallback={revokeAnnouncement}
      noSwitchSigner
    />
  );
}
