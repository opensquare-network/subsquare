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
import Tooltip from "next-common/components/tooltip";
import useNominatorUnClaimedRewards from "./useNominatorUnClaimedRewards";
import { InfoMessage } from "next-common/components/setting/styled";
import { useDispatch } from "react-redux";
import { newSuccessToast } from "next-common/store/reducers/toastSlice";
import FoldableContent from "next-common/components/foldableContent";
import FieldLoading from "next-common/components/icons/fieldLoading";

function Alerts() {
  return (
    <InfoMessage>
      <p className="text-textSecondary text12Medium">
        Claiming a payout claims on behalf of every nominator backing the
        validator for the era you are claiming for. For this reason transaction
        fees are usually higher, and most nominators rely on the validator to
        claim on their behalf. Validators usually claim payouts on behalf of
        their nominators.
        <br />
        <br />
        If you decide not to claim here, it is likely you will receive your
        payouts within 1-2 days of them becoming available.
      </p>
    </InfoMessage>
  );
}

function LoadingContent() {
  return (
    <div className="flex items-center justify-center whitespace-nowrap gap-x-2 text-textTertiary text14Medium py-2">
      <FieldLoading size={24} />
      This process may take a while
    </div>
  );
}

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
  const dispatch = useDispatch();
  const realAddress = useRealAddress();
  const { decimals, symbol } = useChainSettings();

  const { result, loading } = useNominatorUnClaimedRewards(realAddress);
  const { getTxFuncForSubmit, getTxFuncForFee, displayAmount, hasRewards } =
    useClaimRewardsTx(result);

  const handleInBlock = () => {
    dispatch(
      newSuccessToast(
        `Rewards claimed successfully! ${displayAmount} ${symbol} has been added to your account.`,
      ),
    );
  };

  return (
    <div className="space-y-4">
      <Signer noSwitchSigner />
      <SummaryLayout className="grid-cols-2">
        <SummaryItem title="Total Claimable">
          {loading ? (
            <LoadingContent />
          ) : (
            <ValueDisplay value={displayAmount} symbol={symbol} />
          )}
        </SummaryItem>
        {!loading && result?.result && result.result.length > 0 && (
          <SummaryItem title="Rewards by Era">
            <FoldableContent
              items={result.result}
              threshold={5}
              renderItem={(item) => (
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
              )}
            />
          </SummaryItem>
        )}
      </SummaryLayout>
      <Alerts />
      <AdvanceSettings defaultShow>
        <EstimatedGas getTxFunc={getTxFuncForFee} />
      </AdvanceSettings>
      <div className="flex justify-between">
        <SecondaryButton onClick={onClose}>Cancel</SecondaryButton>
        <Tooltip content={!hasRewards && "No claimable rewards"}>
          <TxSubmissionButton
            disabled={!hasRewards}
            getTxFunc={getTxFuncForSubmit}
            onInBlock={handleInBlock}
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
