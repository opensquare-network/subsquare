import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import Popup from "next-common/components/popup/wrapper/Popup";
import SignerPopupWrapper from "next-common/components/popupWithSigner/signerPopupWrapper";
import Signer from "next-common/components/popup/fields/signerField";
import { useContextApi } from "next-common/context/api";
import { useMemo } from "react";
import { useTxBuilder } from "next-common/hooks/useTxBuilder";
import SecondaryButton from "next-common/lib/button/secondary";
import { usePopupParams } from "next-common/components/popupWithSigner/context";
import AdvanceSettings from "next-common/components/summary/newProposalQuickStart/common/advanceSettings";
import EstimatedGas from "next-common/components/estimatedGas";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useChainSettings } from "next-common/context/chain";
import ValueDisplay from "next-common/components/valueDisplay";
import { toPrecision } from "next-common/utils";
import useUnclaimedRewards from "./useUnclaimedRewards";
import SummaryLayout from "next-common/components/summary/layout/layout";
import SummaryItem from "next-common/components/summary/layout/item";
import LoadableContent from "next-common/components/common/loadableContent";
import Tooltip from "next-common/components/tooltip";

function createPayoutExtrinsic(api, details, maxBatchSize = 40) {
  if (!api?.tx?.staking?.payoutStakers || !details || details.length === 0) {
    return null;
  }

  const extrinsics = details
    .slice(0, maxBatchSize)
    .map(({ validatorId, era }) =>
      api.tx.staking.payoutStakers(validatorId, era),
    );

  if (extrinsics.length === 1) {
    return extrinsics[0];
  }

  if (api.tx.utility?.batchAll) {
    return api.tx.utility.batchAll(extrinsics);
  }

  if (api.tx.utility?.batch) {
    return api.tx.utility.batch(extrinsics);
  }

  return extrinsics[0];
}

function ClaimPopupContent() {
  const { onClose } = usePopupParams();
  const api = useContextApi();
  const realAddress = useRealAddress();
  const { decimals, symbol } = useChainSettings();

  const rewardData = useUnclaimedRewards(realAddress);

  const maxBatchSize = useMemo(() => {
    const maxNominators =
      api?.consts?.staking?.maxNominatorRewardedPerValidator?.toNumber() || 64;
    return Math.floor((36 * 64) / maxNominators);
  }, [api]);

  const { getTxFuncForSubmit, getTxFuncForFee } = useTxBuilder(() => {
    if (!rewardData.details || rewardData.details.length === 0) {
      return null;
    }
    return createPayoutExtrinsic(api, rewardData.details, maxBatchSize);
  }, [api, rewardData.details, maxBatchSize]);

  const displayAmount = useMemo(() => {
    if (!rewardData.amount || rewardData.amount.isZero()) {
      return "0";
    }
    return toPrecision(rewardData.amount.toString(), decimals);
  }, [rewardData.amount, decimals]);

  const hasRewards = !rewardData.amount.isZero() && rewardData.totalPayouts > 0;

  return (
    <div className="space-y-4">
      <Signer noSwitchSigner />
      <SummaryLayout>
        <SummaryItem title="Claimable">
          <LoadableContent isLoading={rewardData.isLoading}>
            <ValueDisplay value={displayAmount} symbol={symbol} />
          </LoadableContent>
        </SummaryItem>
      </SummaryLayout>
      <AdvanceSettings>
        <EstimatedGas getTxFunc={getTxFuncForFee} />
      </AdvanceSettings>
      <div className="flex justify-between">
        <SecondaryButton onClick={onClose}>Cancel</SecondaryButton>
        <Tooltip content={!hasRewards && "No claimable rewards"}>
          <TxSubmissionButton
            disabled={!hasRewards}
            getTxFunc={getTxFuncForSubmit}
          />
        </Tooltip>
      </div>
    </div>
  );
}

export default function ClaimPopup({ onClose }) {
  return (
    <SignerPopupWrapper onClose={onClose}>
      <Popup title="Claim Rewards" onClose={onClose}>
        <ClaimPopupContent />
      </Popup>
    </SignerPopupWrapper>
  );
}
