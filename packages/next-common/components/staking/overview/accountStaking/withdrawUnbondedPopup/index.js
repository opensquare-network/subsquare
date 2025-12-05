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
import { useMyPoolInfo } from "next-common/hooks/staking/useMyPool";

function PoolWithdrawUnbondedPopupContent({ poolId }) {
  const api = useContextApi();
  const { decimals, symbol } = useChainSettings();
  const { balances, loading: isBalanceLoading } = useMyPoolInfo();
  const unlocked = balances?.unlocked || 0n;

  const getTxFunc = useCallback(async () => {
    if (!api) {
      return null;
    }
    return api.tx.nominationPools.poolWithdrawUnbonded(poolId, 0);
  }, [api, poolId]);

  return (
    <div className="space-y-4">
      <Signer title="Origin" noSwitchSigner />
      <BalanceField
        title="Withdraw"
        disabled={true}
        isLoading={isBalanceLoading}
        inputBalance={toPrecision(unlocked, decimals)}
        symbol={symbol}
      />
      <AdvanceSettings>
        <EstimatedGas getTxFunc={getTxFunc} />
      </AdvanceSettings>
      <div className="flex justify-end">
        <TxSubmissionButton disabled={isBalanceLoading} getTxFunc={getTxFunc} />
      </div>
    </div>
  );
}

export default function PoolWithdrawUnbondedPopup({ poolId, onClose }) {
  return (
    <SignerPopupWrapper onClose={onClose}>
      <Popup title="Withdraw Unbonded" onClose={onClose}>
        <PoolWithdrawUnbondedPopupContent poolId={poolId} />
      </Popup>
    </SignerPopupWrapper>
  );
}
