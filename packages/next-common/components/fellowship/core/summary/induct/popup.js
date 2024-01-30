import React, { useCallback, useMemo } from "react";
import useAddressInput from "next-common/components/fellowship/core/summary/induct/useAddressInput";
import PopupWithSigner from "next-common/components/popupWithSigner";
import Signer from "next-common/components/popup/fields/signerField";
import { useChainSettings } from "next-common/context/chain";
import useApi from "next-common/utils/hooks/useApi";
import useAddressBalance from "next-common/utils/hooks/useAddressBalance";
import { useSignerAccount } from "next-common/components/popupWithSigner/context";
import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import { useDispatch } from "react-redux";
import { incFellowshipCoreMembersTrigger } from "next-common/store/reducers/fellowship/core";
import { sleep } from "next-common/utils";
import getChainSettings from "next-common/utils/consts/settings";
import { defaultBlockTime } from "next-common/utils/constants";

function Content({ onClose }) {
  const node = useChainSettings();
  const signerAccount = useSignerAccount();
  const api = useApi();
  const [balance, isBalanceLoading] = useAddressBalance(
    api,
    signerAccount?.realAddress,
  );
  const [signerBalance, isSignerBalanceLoading] = useAddressBalance(
    api,
    signerAccount?.address,
  );
  const dispatch = useDispatch();

  const { address: whoAddress, component: whoInput } = useAddressInput("Who");

  const tx = useMemo(() => {
    if (api && whoAddress) {
      return api.tx.fellowshipCore.induct(whoAddress);
    }
  }, [api, whoAddress]);

  const onInBlock = useCallback(async () => {
    const blockTime =
      getChainSettings(process.env.NEXT_PUBLIC_CHAIN).blockTime ||
      defaultBlockTime;

    const timers = [1, 2];
    // eslint-disable-next-line no-unused-vars
    for (const timer of timers) {
      dispatch(incFellowshipCoreMembersTrigger());
      await sleep(blockTime);
    }
  }, [dispatch]);

  return (
    <>
      <Signer
        balanceName="Balance"
        balance={balance}
        isBalanceLoading={isBalanceLoading}
        signerBalance={signerBalance}
        isSignerBalanceLoading={isSignerBalanceLoading}
        symbol={node.symbol}
      />
      {whoInput}
      <TxSubmissionButton
        tx={tx}
        onClose={onClose}
        onInBlock={onInBlock}
        onFinalized={onInBlock}
      />
    </>
  );
}

export default function FellowshipCoreInductionPopup(props) {
  return <PopupWithSigner title="Induct" Component={Content} {...props} />;
}
