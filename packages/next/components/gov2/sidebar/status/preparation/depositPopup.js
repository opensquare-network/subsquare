import PopupWithSigner from "next-common/components/popupWithSigner";
import { usePostOnChainData } from "next-common/context/post";
import { useChainSettings } from "next-common/context/chain";
import BalanceInput from "next-common/components/balanceInput";
import { toPrecision } from "next-common/utils";
import React, { useCallback } from "react";
import PopupLabel from "next-common/components/popup/label";
import Input from "next-common/components/input";
import SignerWithBalance from "next-common/components/signerPopup/signerWithBalance";
import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import { usePopupParams } from "next-common/components/popupWithSigner/context";
import { useContextApi } from "next-common/context/api";
import { useReferendaPallet } from "next-common/context/referenda/pallet";

function PopupContent() {
  const { onClose } = usePopupParams();
  const api = useContextApi();
  const node = useChainSettings();
  const { referendumIndex, trackInfo: track } = usePostOnChainData();
  const pallet = useReferendaPallet();

  const getTxFunc = useCallback(() => {
    if (api && api.tx[pallet]) {
      return api.tx[pallet].placeDecisionDeposit(referendumIndex);
    }
  }, [api, referendumIndex, pallet]);

  return (
    <>
      <SignerWithBalance />
      <div>
        <PopupLabel text={"Referendum ID"} />
        <Input value={referendumIndex} disabled={true} />
      </div>
      <div>
        <PopupLabel text={"Decision Deposit"} />
        <BalanceInput
          disabled={true}
          value={toPrecision(track.decisionDeposit, node.decimals)}
          symbol={node?.symbol}
        />
      </div>

      <TxSubmissionButton getTxFunc={getTxFunc} onClose={onClose} />
    </>
  );
}

export default function DepositPopup(props) {
  return (
    <PopupWithSigner title="Place decision deposit" {...props}>
      <PopupContent />
    </PopupWithSigner>
  );
}
