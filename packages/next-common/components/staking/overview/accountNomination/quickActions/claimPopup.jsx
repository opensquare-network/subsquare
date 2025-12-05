import { useMemo } from "react";
import { useContextApi } from "next-common/context/api";
import { useTxBuilder } from "next-common/hooks/useTxBuilder";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useChainSettings } from "next-common/context/chain";
import { usePopupParams } from "next-common/components/popupWithSigner/context";
import { toPrecision } from "next-common/utils";
import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import Popup from "next-common/components/popup/wrapper/Popup";
import SignerPopupWrapper from "next-common/components/popupWithSigner/signerPopupWrapper";
import Signer from "next-common/components/popup/fields/signerField";
import SecondaryButton from "next-common/lib/button/secondary";
import AdvanceSettings from "next-common/components/summary/newProposalQuickStart/common/advanceSettings";
import EstimatedGas from "next-common/components/estimatedGas";
import ValueDisplay from "next-common/components/valueDisplay";
import SummaryLayout from "next-common/components/summary/layout/layout";
import SummaryItem from "next-common/components/summary/layout/item";
import LoadableContent from "next-common/components/common/loadableContent";
import Tooltip from "next-common/components/tooltip";
import useUnclaimedRewards from "./useUnclaimedRewards";

function createPayoutExtrinsic(api, details, maxBatchSize = 40) {
  if (!api?.tx?.staking?.payoutStakers || !details || details.length === 0) {
    return null;
  }

  const extrinsics = details
    .slice(0, maxBatchSize)
    .map(({ validatorId, era }) =>
      api.tx.staking.payoutStakers(validatorId, era),
    );

  if (extrinsics.length === 0) {
    return null;
  }

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

function useClaimRewardsTx(rewardsData) {
  const api = useContextApi();
  const { decimals } = useChainSettings();

  const maxBatchSize = useMemo(() => {
    const maxNominators =
      api?.consts?.staking?.maxNominatorRewardedPerValidator?.toNumber() || 64;
    return Math.floor((36 * 64) / maxNominators);
  }, [api]);

  const { getTxFuncForSubmit, getTxFuncForFee } = useTxBuilder(() => {
    if (!rewardsData?.details || rewardsData.details.length === 0) {
      return null;
    }
    return createPayoutExtrinsic(api, rewardsData.details, maxBatchSize);
  }, [api, rewardsData?.details, maxBatchSize]);

  const displayAmount = useMemo(() => {
    if (!rewardsData?.totalRewards || rewardsData.totalRewards === "0") {
      return "0";
    }
    return toPrecision(rewardsData.totalRewards, decimals);
  }, [rewardsData?.totalRewards, decimals]);

  const hasRewards = rewardsData?.details && rewardsData.details.length > 0;

  return {
    getTxFuncForSubmit,
    getTxFuncForFee,
    displayAmount,
    hasRewards,
  };
}

function ClaimPopupContent() {
  const { onClose } = usePopupParams();
  const realAddress = useRealAddress();
  const { decimals, symbol } = useChainSettings();

  const { result, loading } = useUnclaimedRewards(realAddress);
  const { getTxFuncForSubmit, getTxFuncForFee, displayAmount, hasRewards } =
    useClaimRewardsTx(result);

  return (
    <div className="space-y-4">
      <Signer noSwitchSigner />
      <SummaryLayout>
        <SummaryItem title="Total Claimable">
          <LoadableContent isLoading={loading}>
            <ValueDisplay value={displayAmount} symbol={symbol} />
          </LoadableContent>
        </SummaryItem>
        {!loading && result?.result && result.result.length > 0 && (
          <SummaryItem title="Rewards by Era">
            <div className="space-y-1">
              {result.result.map((item) => (
                <div
                  key={item.era}
                  className="flex items-center space-x-1 text14Medium"
                >
                  <span className="text-textSecondary">Era {item.era}: </span>
                  <ValueDisplay
                    value={toPrecision(item.unClaimedRewards, decimals)}
                    symbol={symbol}
                    showVerySmallNumber={true}
                  />
                </div>
              ))}
            </div>
          </SummaryItem>
        )}
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
