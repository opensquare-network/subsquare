import React, { useCallback } from "react";
import useAddressInput from "next-common/components/fellowship/core/summary/induct/useAddressInput";
import PopupWithSigner from "next-common/components/popupWithSigner";
import useApi from "next-common/utils/hooks/useApi";
import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import useSigner from "next-common/components/common/tx/useSigner";
import useFellowshipMembersUpdateFunc from "next-common/components/fellowship/core/updateFunc";

function Content({ onClose }) {
  const { component } = useSigner("Origin");
  const api = useApi();
  const { address: whoAddress, component: whoInput } = useAddressInput("Who");

  const getTxFunc = useCallback(() => {
    if (api && whoAddress) {
      return api.tx.fellowshipCore.induct(whoAddress);
    }
  }, [api, whoAddress]);

  const onInBlock = useFellowshipMembersUpdateFunc();

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
  return <PopupWithSigner title="Induct" Component={Content} {...props} />;
}
