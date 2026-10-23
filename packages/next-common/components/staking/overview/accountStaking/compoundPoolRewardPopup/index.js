import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import EstimatedGas from "next-common/components/estimatedGas";
import BalanceField from "next-common/components/popup/fields/balanceField";
import Signer from "next-common/components/popup/fields/signerField";
import PopupWithSigner from "next-common/components/popupWithSigner";
import AdvanceSettings from "next-common/components/summary/newProposalQuickStart/common/advanceSettings";
import { useContextApi } from "next-common/context/api";
import { useChainSettings } from "next-common/context/chain";
import { toPrecision } from "next-common/utils";
import { useCallback } from "react";
import { useMyPoolRewardContext } from "next-common/context/staking/poolReward";

function CompoundPoolRewardPopupContent() {
  const api = useContextApi();
  const { decimals, symbol } = useChainSettings();
  const {
    claimable,
    loading: isClaimableLoading,
    refresh,
  } = useMyPoolRewardContext();

  const getTxFunc = useCallback(async () => {
    return api?.tx.nominationPools?.bondExtra({
      rewards: null,
    });
  }, [api]);

  const hasClaimable = claimable && claimable > 0n;

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
          disabled={isClaimableLoading || !hasClaimable}
          getTxFunc={getTxFunc}
          onInBlock={refresh}
        />
      </div>
    </div>
  );
}

export default function CompoundPoolRewardPopup({ onClose }) {
  return (
    <PopupWithSigner title="Compound Reward" onClose={onClose}>
      <CompoundPoolRewardPopupContent />
    </PopupWithSigner>
  );
}
