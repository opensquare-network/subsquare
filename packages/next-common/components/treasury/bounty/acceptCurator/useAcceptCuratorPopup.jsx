import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import BalanceField from "next-common/components/popup/fields/balanceField";
import Signer from "next-common/components/popup/fields/signerField";
import PopupWithSigner from "next-common/components/popupWithSigner";
import {
  usePopupParams,
  useSignerAccount,
} from "next-common/components/popupWithSigner/context";
import { useContextApi } from "next-common/context/api";
import { useChainSettings } from "next-common/context/chain";
import { useOnchainData } from "next-common/context/post";
import { useSubBalanceInfo } from "next-common/hooks/balance/useSubBalanceInfo";
import { toPrecision } from "next-common/utils";
import { useCallback, useState } from "react";

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
  const { onClose } = usePopupParams();
  const api = useContextApi();

  const signerAccount = useSignerAccount();
  const address = signerAccount?.realAddress;

  const { value: balance, loading } = useSubBalanceInfo(address);

  const getTxFunc = useCallback(() => {
    if (!api?.tx?.[pallet]) {
      return null;
    }

    return api.tx[pallet].acceptCurator(...params);
  }, [api, pallet, params]);

  return (
    <>
      <Signer
        balanceName="Available"
        signerBalance={balance?.balance}
        isSignerBalanceLoading={loading}
      />
      <BalanceField
        title="Curator Deposit"
        disabled
        inputBalance={toPrecision(curatorDeposit, decimals)}
        symbol={symbol}
      />
      <div className="flex justify-end">
        <TxSubmissionButton
          title="Confirm"
          getTxFunc={getTxFunc}
          onClose={onClose}
        />
      </div>
    </>
  );
}

function AcceptCuratorPopup(props) {
  return (
    <PopupWithSigner title="Accept Curator" className="!w-[640px]" {...props}>
      <PopupContent pallet={props.pallet} params={props.params} />
    </PopupWithSigner>
  );
}
