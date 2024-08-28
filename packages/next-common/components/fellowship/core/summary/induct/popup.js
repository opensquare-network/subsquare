import React, { useCallback } from "react";
import PopupWithSigner from "next-common/components/popupWithSigner";
import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import useSigner from "next-common/components/common/tx/useSigner";
import useCoreFellowshipUpdateFunc from "next-common/components/collectives/core/updateFunc";
import { usePopupParams } from "next-common/components/popupWithSigner/context";
import { useContextApi } from "next-common/context/api";
import useAddressInput from "next-common/components/collectives/core/useAddressInput";
import { useCoreFellowshipPallet } from "next-common/context/collectives/collectives";

function Content() {
  const pallet = useCoreFellowshipPallet();
  const { onClose } = usePopupParams();
  const { component } = useSigner("Origin");
  const api = useContextApi();
  const { address: whoAddress, component: whoInput } = useAddressInput("Who");

  const getTxFunc = useCallback(() => {
    if (api && whoAddress) {
      return api.tx[pallet].induct(whoAddress);
    }
  }, [api, whoAddress, pallet]);

  const onInBlock = useCoreFellowshipUpdateFunc();

  return (
    <>
      {component}
      {whoInput}
      <TxSubmissionButton
        getTxFunc={getTxFunc}
        onClose={onClose}
        onInBlock={onInBlock}
        onFinalized={onInBlock}
      />
    </>
  );
}

export default function FellowshipCoreInductionPopup(props) {
  return (
    <PopupWithSigner title="Induct" className="!w-[640px]" {...props}>
      <Content />
    </PopupWithSigner>
  );
}
