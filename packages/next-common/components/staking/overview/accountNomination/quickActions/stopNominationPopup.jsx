import BigNumber from "bignumber.js";
import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import EstimatedGas from "next-common/components/estimatedGas";
import BalanceField from "next-common/components/popup/fields/balanceField";
import Signer from "next-common/components/popup/fields/signerField";
import TextInputField from "next-common/components/popup/fields/textInputField";
import Popup from "next-common/components/popup/wrapper/Popup";
import SignerPopupWrapper from "next-common/components/popupWithSigner/signerPopupWrapper";
import { InfoMessage } from "next-common/components/setting/styled";
import AdvanceSettings from "next-common/components/summary/newProposalQuickStart/common/advanceSettings";
import { useContextApi } from "next-common/context/api";
import { useChainSettings } from "next-common/context/chain";
import { useMyStakingLedger } from "next-common/context/staking/myStakingLedger";
import { toPrecision } from "next-common/utils";
import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { newSuccessToast } from "next-common/store/reducers/toastSlice";

function StopNominatingPopupContent() {
  const dispatch = useDispatch();
  const api = useContextApi();
  const { decimals, symbol } = useChainSettings();
  const { ledger, nominators, loading } = useMyStakingLedger();
  const bond = ledger?.active || 0;
  const validatorCount = nominators?.targets.length || 0;

  const getTxFunc = useCallback(() => {
    if (new BigNumber(bond).isZero()) {
      return api.tx.staking.chill();
    }
    return api.tx.utility.batchAll([
      api.tx.staking.chill(),
      api.tx.staking.unbond(bond),
    ]);
  }, [api, bond]);

  const handleInBlock = useCallback(() => {
    const bondAmount = toPrecision(bond, decimals);
    const message = new BigNumber(bond).isZero()
      ? `Successfully stopped nominating ${validatorCount} validators.`
      : `Successfully stopped nominating ${validatorCount} validators and unbonded ${bondAmount} ${symbol}.`;
    dispatch(newSuccessToast(message));
  }, [dispatch, bond, decimals, symbol, validatorCount]);

  return (
    <div className="space-y-4">
      <Signer title="Origin" noSwitchSigner />
      <BalanceField
        title="Unbond"
        disabled={true}
        isLoading={loading}
        inputBalance={toPrecision(bond, decimals)}
        symbol={symbol}
      />
      <TextInputField
        title="Un-nominate"
        disabled={true}
        isLoading={loading}
        text={`Stop Nominating ${validatorCount} Validators`}
      />
      <InfoMessage>
        Once unbonding, your funds will become available after 28 days.
      </InfoMessage>
      <AdvanceSettings>
        <EstimatedGas getTxFunc={getTxFunc} />
      </AdvanceSettings>
      <div className="flex justify-end">
        <TxSubmissionButton
          disabled={loading}
          getTxFunc={getTxFunc}
          onInBlock={handleInBlock}
        />
      </div>
    </div>
  );
}

export default function StopNominationPopup({ onClose }) {
  return (
    <SignerPopupWrapper onClose={onClose}>
      <Popup title="Stop Nominating" onClose={onClose}>
        <StopNominatingPopupContent />
      </Popup>
    </SignerPopupWrapper>
  );
}
