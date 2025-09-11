import PopupWithSigner from "next-common/components/popupWithSigner";
import React, { useCallback } from "react";
import useSigner from "next-common/components/common/tx/useSigner";
import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import useCoreFellowshipUpdateFunc from "next-common/components/collectives/core/updateFunc";
import { useContextApi } from "next-common/context/api";
import { useCoreFellowshipPallet } from "next-common/context/collectives/collectives";

function Content() {
  const pallet = useCoreFellowshipPallet();
  const { component } = useSigner();
  const api = useContextApi();

  const getTxFunc = useCallback(() => {
    if (api) {
      return api.tx[pallet].import();
    }
  }, [api, pallet]);

  const onInBlock = useCoreFellowshipUpdateFunc();

  return (
    <>
      {component}
      <TxSubmissionButton
        getTxFunc={getTxFunc}
        onInBlock={onInBlock}
        onFinalized={onInBlock}
      />
    </>
  );
}

export default function FellowshipCoreImportPopup(props) {
  return (
    <PopupWithSigner title="Import" {...props}>
      <Content />
    </PopupWithSigner>
  );
}
