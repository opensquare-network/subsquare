import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import BalanceField from "next-common/components/popup/fields/balanceField";
import Signer from "next-common/components/popup/fields/signerField";
import PopupWithSigner from "next-common/components/popupWithSigner";
import { usePopupParams } from "next-common/components/popupWithSigner/context";
import { useContextApi } from "next-common/context/api";
import { useChainSettings } from "next-common/context/chain";
import { useOnchainData } from "next-common/context/post";
import { useSubBalanceInfo } from "next-common/hooks/balance/useSubBalanceInfo";
import { toPrecision } from "next-common/utils";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useCallback, useState } from "react";

export function useAcceptCuratorPopup() {
  const [isOpen, setIsOpen] = useState(false);

  const component = isOpen && (
    <AcceptCuratorPopup
      onClose={() => {
        setIsOpen(false);
      }}
    />
  );

  return {
    component,
    showPopup() {
      setIsOpen(true);
    },
  };
}

function PopupContent() {
  const onchainData = useOnchainData();
  const { symbol, decimals } = useChainSettings();
  const { parentBountyId, index: childBountyId, meta } = onchainData;
  const { curatorDeposit } = meta || {};
  const { onClose } = usePopupParams();
  const api = useContextApi();
  const address = useRealAddress();
  const { value: balance, loading } = useSubBalanceInfo(address);

  const getTxFunc = useCallback(() => {
    if (!api?.tx?.childBounties) {
      return null;
    }

    return api.tx.childBounties.acceptCurator(parentBountyId, childBountyId);
  }, [api, childBountyId, parentBountyId]);

  return (
    <>
      <Signer
        balanceName="Available"
        signerBalance={balance?.balance}
        isSignerBalanceLoading={loading}
      />
      <BalanceField
        title="Curator Deposit"
        isLoading={loading}
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
      <PopupContent />
    </PopupWithSigner>
  );
}
