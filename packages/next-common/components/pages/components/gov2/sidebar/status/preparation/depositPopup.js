import PopupWithSigner from "next-common/components/popupWithSigner";
import { usePostOnChainData } from "next-common/context/post";
import { useChainSettings } from "next-common/context/chain";
import { toPrecision } from "next-common/utils";
import React, { useCallback } from "react";
import PopupLabel from "next-common/components/popup/label";
import Input from "next-common/lib/input";
import Signer from "next-common/components/popup/fields/signerField";
import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import { usePopupParams } from "next-common/components/popupWithSigner/context";
import { useContextApi } from "next-common/context/api";
import { useReferendaPallet } from "next-common/context/referenda/pallet";
import CurrencyInput from "next-common/components/currencyInput";
import BalanceProvider, {
  useBalanceContext,
} from "next-common/context/balance";
import { GreyPanel } from "next-common/components/styled/containers/greyPanel";
import { colorStyle, PromptTypes } from "next-common/components/scrollPrompt";
import BigNumber from "bignumber.js";

function PopupContent() {
  const { onClose } = usePopupParams();
  const { transferrable, loading } = useBalanceContext() || {};
  const api = useContextApi();
  const node = useChainSettings();
  const { referendumIndex, trackInfo: track } = usePostOnChainData();
  const pallet = useReferendaPallet();

  const getTxFunc = useCallback(() => {
    if (api && api.tx[pallet]) {
      return api.tx[pallet].placeDecisionDeposit(referendumIndex);
    }
  }, [api, referendumIndex, pallet]);

  const isEnough = BigNumber(transferrable).gte(track.decisionDeposit);

  return (
    <>
      <Signer
        showTransferable
        balance={transferrable}
        isBalanceLoading={loading}
        balanceName="Available Balance"
      />
      <div>
        <PopupLabel text={"Referendum ID"} />
        <Input value={referendumIndex} disabled={true} />
      </div>
      <div>
        <PopupLabel text={"Decision Deposit"} />
        <CurrencyInput
          disabled
          value={toPrecision(track.decisionDeposit, node.decimals)}
          symbol={node?.symbol}
        />
      </div>
      <GreyPanel
        className="text14Medium px-4 py-[10px]"
        style={
          isEnough
            ? colorStyle[PromptTypes.SUCCESS]
            : colorStyle[PromptTypes.WARNING]
        }
      >
        {isEnough
          ? "Your free balance is enough to pay deposits."
          : "Your free balance is not enough to pay deposits."}
      </GreyPanel>
      <TxSubmissionButton getTxFunc={getTxFunc} onClose={onClose} />
    </>
  );
}

export default function DepositPopup(props) {
  return (
    <PopupWithSigner title="Place decision deposit" {...props}>
      <BalanceProvider>
        <PopupContent />
      </BalanceProvider>
    </PopupWithSigner>
  );
}
