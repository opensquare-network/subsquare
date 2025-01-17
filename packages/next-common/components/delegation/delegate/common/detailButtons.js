import SecondaryButton from "next-common/lib/button/secondary";
import { SystemSubtract } from "@osn/icons/subsquare";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useCallback } from "react";
import SignerPopupWrapper from "next-common/components/popupWithSigner/signerPopupWrapper";
import {
  newErrorToast,
  newSuccessToast,
} from "next-common/store/reducers/toastSlice";
import nextApi from "next-common/services/nextApi";
import { getRealField } from "next-common/sima/actions/common";
import { setReferendaDelegatesTriggerUpdate } from "next-common/store/reducers/referenda/delegates";
import { setDemocracyDelegatesTriggerUpdate } from "next-common/store/reducers/democracy/delegates";
import { useDispatch } from "react-redux";
import { useSignMessage } from "next-common/hooks/useSignMessage";
import {
  Referenda,
  useModuleTab,
} from "next-common/components/profile/votingHistory/common";
import { useSignerAccount } from "next-common/components/popupWithSigner/context";
import { useMyProxied } from "next-common/context/proxy";
import { isAddressInGroup, isSameAddress } from "next-common/utils";

function RevokeContent({ address }) {
  const dispatch = useDispatch();
  const signerAccount = useSignerAccount();
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

  const revokeAnnouncement = useCallback(async () => {
    const proxyAddress = !isSameAddress(address, signerAccount.address)
      ? address
      : null;

    try {
      const entity = {
        action: "unset-delegation-announcement",
        timestamp: Date.now(),
        real: getRealField(proxyAddress),
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
      dispatch(newSuccessToast("Announcement revoked"));
      triggerUpdate();
    } catch (e) {
      dispatch(newErrorToast(e.message));
    }
  }, [dispatch, address, triggerUpdate, signerAccount, signMessage]);

  return (
    <SecondaryButton
      size="small"
      iconLeft={<SystemSubtract className="w-4 h-4" />}
      onClick={() => revokeAnnouncement()}
    >
      Revoke
    </SecondaryButton>
  );
}

export function RevokeButton({ address }) {
  return (
    <SignerPopupWrapper>
      <RevokeContent address={address} />
    </SignerPopupWrapper>
  );
}

export default function DetailButtons({ address }) {
  const realAddress = useRealAddress();
  const isMyDelegate = isSameAddress(address, realAddress);
  const { proxies } = useMyProxied();
  const delegators = proxies?.map((proxy) => proxy.delegator);
  const isMyProxiedDelegate = isAddressInGroup(address, delegators);

  return (
    (isMyDelegate || isMyProxiedDelegate) && (
      <div className="flex gap-[8px]">
        <RevokeButton address={address} />
      </div>
    )
  );
}
