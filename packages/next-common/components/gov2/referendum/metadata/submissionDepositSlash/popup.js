import React, { useCallback } from "react";
import { isNil } from "lodash-es";
import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import PopupWithSigner from "next-common/components/popupWithSigner";
import useSigner from "next-common/components/common/tx/useSigner";
import ReferendumIndexRow from "next-common/components/gov2/referendum/metadata/refund/referendumIndexRow";
import { usePopupParams } from "next-common/components/popupWithSigner/context";
import { useContextApi } from "next-common/context/api";
import AdvanceSettings from "next-common/components/summary/newProposalQuickStart/common/advanceSettings";
import EstimatedGas from "next-common/components/estimatedGas";
import { WarningMessage } from "next-common/components/popup/styled";

function Content() {
  const { referendumIndex, pallet = "referenda" } = usePopupParams();
  const { component } = useSigner("Origin");
  const api = useContextApi();

  const getTxFunc = useCallback(() => {
    if (!api?.tx?.[pallet]?.slashSubmissionDeposit || isNil(referendumIndex)) {
      return null;
    }

    return api.tx[pallet].slashSubmissionDeposit(referendumIndex);
  }, [api, pallet, referendumIndex]);

  return (
    <>
      {component}
      <ReferendumIndexRow referendumIndex={referendumIndex} />
      <WarningMessage danger className="mt-[16px] mb-[16px]">
        The submission deposit will be slashed and will not be returned.
      </WarningMessage>
      <AdvanceSettings>
        <EstimatedGas getTxFunc={getTxFunc} />
      </AdvanceSettings>
      <TxSubmissionButton getTxFunc={getTxFunc} />
    </>
  );
}

export default function SubmissionDepositSlashPopup(props) {
  return (
    <PopupWithSigner title="Slash submission deposit" {...props}>
      <Content />
    </PopupWithSigner>
  );
}
