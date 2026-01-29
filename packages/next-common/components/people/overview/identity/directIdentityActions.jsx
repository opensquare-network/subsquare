import { cn } from "next-common/utils";
import { SystemEdit2 } from "@osn/icons/subsquare";
import { useContextApi } from "next-common/context/api";
import { useDispatch } from "react-redux";
import { newSuccessToast } from "next-common/store/reducers/toastSlice";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import useTxSubmission from "next-common/components/common/tx/useTxSubmission";
import RemoveButton from "next-common/components/removeButton";
import Tooltip from "next-common/components/tooltip";
import { clearCachedIdentitys } from "next-common/services/identity";
import { useChain } from "next-common/context/chain";
import { useExtensionAccounts } from "next-common/components/popupWithSigner/context";
import getChainSettings from "next-common/utils/consts/settings";
import { useCallback, useState } from "react";
import dynamicPopup from "next-common/lib/dynamic/popup";
import CheckJudgement from "./checkJudgement";

const SetIdentityPopup = dynamicPopup(
  () => import("next-common/components/setIdentityPopup"),
  {
    ssr: false,
  },
);

export function DirectIdentityActions() {
  const chain = useChain();
  const { identity: identityChain } = getChainSettings(chain);
  const [showSetIdentityPopup, setShowSetIdentityPopup] = useState(false);
  const extensionAccounts = useExtensionAccounts();

  const api = useContextApi();
  const dispatch = useDispatch();
  const address = useRealAddress();

  const getTxFunc = useCallback(() => {
    if (!api || !api?.tx?.identity || !address) {
      return;
    }

    return api.tx.identity.clearIdentity();
  }, [api, address]);

  const onInBlock = useCallback(() => {
    dispatch(newSuccessToast("Clear identity successfully"));
  }, [dispatch]);

  const { doSubmit, isSubmitting } = useTxSubmission({
    getTxFunc,
    onInBlock,
  });

  const clearIdentity = useCallback(async () => {
    try {
      await doSubmit();
      clearCachedIdentitys(
        extensionAccounts.map(({ address }) => ({
          chain: identityChain,
          address,
        })),
      );
    } catch (error) {
      console.error(error);
    }
  }, [extensionAccounts, identityChain, doSubmit]);

  return (
    <>
      <div className="flex items-center gap-2 text-textPrimary">
        <CheckJudgement />
        <div
          className={cn(
            "flex justify-center items-center",
            "bg-neutral100 border border-neutral400 rounded-md w-[28px] h-[28px]",
            "cursor-pointer",
          )}
          onClick={() => setShowSetIdentityPopup(true)}
        >
          <Tooltip content="Edit Identity">
            <SystemEdit2 className="w-[16px] h-[16px]" />
          </Tooltip>
        </div>
        <Tooltip content="Clear Identity">
          <RemoveButton disabled={isSubmitting} onClick={clearIdentity} />
        </Tooltip>
      </div>
      {showSetIdentityPopup && (
        <SetIdentityPopup onClose={() => setShowSetIdentityPopup(false)} />
      )}
    </>
  );
}
