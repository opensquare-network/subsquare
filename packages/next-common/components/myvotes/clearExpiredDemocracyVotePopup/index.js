import React, { useCallback, useMemo } from "react";
import RelatedReferenda from "../popupCommon/relatedReferenda";
import { useContextApi } from "next-common/context/api";
import { useSignerAccount } from "next-common/components/popupWithSigner/context";
import PopupWithSigner from "next-common/components/popupWithSigner";
import SignerWithBalance from "next-common/components/signerPopup/signerWithBalance";
import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";

function PopupContent({ votes }) {
  const api = useContextApi();
  const signerAccount = useSignerAccount();
  const realAddress = signerAccount?.realAddress;

  const relatedReferenda = useMemo(() => {
    const referenda = [...new Set(votes)];
    referenda.sort((a, b) => a - b);
    return referenda;
  }, [votes]);

  const getTxFunc = useCallback(async () => {
    let tx;

    const txsRemoveVote = relatedReferenda.map((referendumIndex) =>
      api.tx.democracy.removeVote(referendumIndex),
    );
    const txUnlock = api.tx.democracy.unlock(realAddress);
    const allTx = [...txsRemoveVote, txUnlock];
    if (allTx.length > 1) {
      tx = api.tx.utility.batch([...txsRemoveVote, txUnlock]);
    } else {
      tx = allTx[0];
    }

    return tx;
  }, [api, relatedReferenda, realAddress]);

  return (
    <>
      <SignerWithBalance noSwitchSigner />
      <RelatedReferenda relatedReferenda={relatedReferenda} />
      <TxSubmissionButton title="Confirm" getTxFunc={getTxFunc} />
    </>
  );
}

export default function ClearExpiredDemocracyVotePopup({ votes, onClose }) {
  const title = votes.length <= 0 ? "Unlock" : "Clear Expired Votes";

  return (
    <PopupWithSigner title={title} onClose={onClose}>
      <PopupContent votes={votes} />
    </PopupWithSigner>
  );
}
