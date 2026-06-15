import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import BalanceField from "next-common/components/popup/fields/balanceField";
import PopupWithSigner from "next-common/components/popupWithSigner";
import { useChainSettings } from "next-common/context/chain";
import { useOnchainData } from "next-common/context/post";
import { toPrecision } from "next-common/utils";
import { useCallback, useState } from "react";
import SignerWithBalance from "next-common/components/signerPopup/signerWithBalance";
import { useConditionalContextApi } from "next-common/context/migration/conditionalApi";
import AdvanceSettings from "next-common/components/summary/newProposalQuickStart/common/advanceSettings";
import EstimatedGas from "next-common/components/estimatedGas";

export function useAcceptCuratorPopup(pallet = "bounties", params = []) {
  const [isOpen, setIsOpen] = useState(false);

  const component = isOpen && (
    <AcceptCuratorPopup
      pallet={pallet}
      params={params}
      onClose={() => {
        setIsOpen(false);
      }}
    />
  );

  return {
    component,
    showPopupFn() {
      setIsOpen(true);
    },
  };
}

function PopupContent({ pallet = "bounties", params = [] } = {}) {
  const onchainData = useOnchainData();
  const { symbol, decimals } = useChainSettings();
  const { meta } = onchainData;
  const { curatorDeposit } = meta || {};
  const api = useConditionalContextApi();

  const getTxFunc = useCallback(() => {
    if (!api?.tx?.[pallet]) {
      return null;
    }

    return api.tx[pallet].acceptCurator(...params);
  }, [api, pallet, params]);

  return (
    <>
      <SignerWithBalance />
      <BalanceField
        title="Curator Deposit"
        disabled
        inputBalance={toPrecision(curatorDeposit, decimals)}
        symbol={symbol}
      />
      <AdvanceSettings>
        <EstimatedGas getTxFunc={getTxFunc} />
      </AdvanceSettings>
      <div className="flex justify-end">
        <TxSubmissionButton title="Confirm" getTxFunc={getTxFunc} />
      </div>
    </>
  );
}

function AcceptCuratorPopup(props) {
  return (
    <PopupWithSigner title="Accept Curator" {...props}>
      <PopupContent pallet={props.pallet} params={props.params} />
    </PopupWithSigner>
  );
}
