import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import EstimatedGas from "next-common/components/estimatedGas";
import BalanceField from "next-common/components/popup/fields/balanceField";
import Signer from "next-common/components/popup/fields/signerField";
import Popup from "next-common/components/popup/wrapper/Popup";
import SignerPopupWrapper from "next-common/components/popupWithSigner/signerPopupWrapper";
import AdvanceSettings from "next-common/components/summary/newProposalQuickStart/common/advanceSettings";
import { useContextApi } from "next-common/context/api";
import { useChainSettings } from "next-common/context/chain";
import { toPrecision } from "next-common/utils";
import { useCallback } from "react";
import { useRewardClaimable } from "next-common/components/staking/pools/hooks/useRewardClaimable";

function ClaimPoolRewardPopupContent() {
  const api = useContextApi();
  const { decimals, symbol } = useChainSettings();
  const { claimable, loading: isClaimableLoading } = useRewardClaimable();

  const getTxFunc = useCallback(async () => {
    if (!api) {
      return null;
    }
    return api.tx.nominationPools.claimPayout();
  }, [api]);

  return (
    <div className="space-y-4">
      <Signer title="Origin" noSwitchSigner />
      <BalanceField
        title="Claimable"
        disabled={true}
        isLoading={isClaimableLoading}
        inputBalance={toPrecision(claimable || 0n, decimals)}
        symbol={symbol}
      />
      <AdvanceSettings>
        <EstimatedGas getTxFunc={getTxFunc} />
      </AdvanceSettings>
      <div className="flex justify-end">
        <TxSubmissionButton
          disabled={isClaimableLoading}
          getTxFunc={getTxFunc}
        />
      </div>
    </div>
  );
}

export default function ClaimPoolRewardPopup({ onClose }) {
  return (
    <SignerPopupWrapper onClose={onClose}>
      <Popup title="Claim Reward" onClose={onClose}>
        <ClaimPoolRewardPopupContent />
      </Popup>
    </SignerPopupWrapper>
  );
}
