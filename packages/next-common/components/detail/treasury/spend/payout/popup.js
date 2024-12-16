import PopupWithSigner from "next-common/components/popupWithSigner";
import React, { useCallback } from "react";
import useSigner from "next-common/components/common/tx/useSigner";
import { useContextApi } from "next-common/context/api";
import { useOnchainData } from "next-common/context/post";
import { isNil } from "lodash-es";
import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import { useTreasuryPallet } from "next-common/context/treasury";

function Content() {
  const { component } = useSigner("Origin");
  const api = useContextApi();
  const { index } = useOnchainData() || {};
  const treasuryPallet = useTreasuryPallet();

  const getTxFunc = useCallback(() => {
    if (api && !isNil(index)) {
      return api.tx[treasuryPallet].payout(index);
    }
  }, [api, index, treasuryPallet]);

  return (
    <>
      {component}
      <TxSubmissionButton title="Pay" getTxFunc={getTxFunc} />
    </>
  );
}

export default function Popup(props) {
  return (
    <PopupWithSigner title="Payout" {...props}>
      <Content />
    </PopupWithSigner>
  );
}
