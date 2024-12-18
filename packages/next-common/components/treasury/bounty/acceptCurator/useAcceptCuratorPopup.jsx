import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import BalanceField from "next-common/components/popup/fields/balanceField";
import PopupWithSigner from "next-common/components/popupWithSigner";
import { useContextApi } from "next-common/context/api";
import { useChainSettings } from "next-common/context/chain";
import { useOnchainData } from "next-common/context/post";
import { toPrecision } from "next-common/utils";
import { useCallback, useState } from "react";
import SignerWithBalance from "next-common/components/signerPopup/signerWithBalance";

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
  const api = useContextApi();

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
