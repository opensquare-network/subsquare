import { useState } from "react";
import { useContextApi } from "next-common/context/api";
import { useTxBuilder } from "next-common/hooks/useTxBuilder";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useChainSettings } from "next-common/context/chain";
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
import useNominatorUnClaimedRewards from "./useNominatorUnClaimedRewards";
import { useDispatch } from "react-redux";
import { newSuccessToast } from "next-common/store/reducers/toastSlice";
import FieldLoading from "next-common/components/icons/fieldLoading";
import PrimaryButton from "next-common/lib/button/primary";
import { InfoMessage } from "next-common/components/setting/styled";
import { GreyPanel } from "next-common/components/styled/containers/greyPanel";

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

function useClaimEraRewardsTx(eraData) {
  const api = useContextApi();

  const { getTxFuncForSubmit, getTxFuncForFee } = useTxBuilder(() => {
    if (!api?.tx?.staking?.payoutStakers || !eraData?.validators?.length) {
      return null;
    }

    const extrinsics = eraData.validators.map(({ validatorId }) =>
      api.tx.staking.payoutStakers(validatorId, eraData.era),
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
  }, [api, eraData]);

  return { getTxFuncForSubmit, getTxFuncForFee };
}

function EraRewardItem({ eraData, onClaimClick }) {
  const { decimals, symbol } = useChainSettings();

  return (
    <GreyPanel className="flex items-center justify-between py-2 px-4">
      <div className="flex items-center gap-x-2 text14Medium">
        <span className="text-textPrimary">Era {eraData.era}</span>
        <ValueDisplay
          value={toPrecision(eraData.unClaimedRewards, decimals)}
          symbol={symbol}
          showVerySmallNumber
        />
      </div>
      <PrimaryButton size="small" onClick={() => onClaimClick(eraData)}>
        Claim
      </PrimaryButton>
    </GreyPanel>
  );
}

function ClaimEraPopupContent({ eraData, onBack }) {
  const dispatch = useDispatch();
  const { decimals, symbol } = useChainSettings();
  const { getTxFuncForSubmit, getTxFuncForFee } = useClaimEraRewardsTx(eraData);

  const displayAmount = toPrecision(eraData.unClaimedRewards, decimals);

  const handleInBlock = () => {
    dispatch(
      newSuccessToast(
        `Era ${eraData.era} rewards claimed successfully! ${displayAmount} ${symbol} has been added to your account.`,
      ),
    );
    onBack();
  };

  return (
    <div className="space-y-4">
      <Signer noSwitchSigner />
      <SummaryLayout>
        <SummaryItem title="Era">
          <span className="text14Medium text-textPrimary">{eraData.era}</span>
        </SummaryItem>
        <SummaryItem title="Claimable Rewards">
          <ValueDisplay value={displayAmount} symbol={symbol} />
        </SummaryItem>
      </SummaryLayout>
      <AdvanceSettings defaultShow>
        <EstimatedGas getTxFunc={getTxFuncForFee} />
      </AdvanceSettings>
      <div className="flex justify-end gap-x-4">
        <SecondaryButton onClick={onBack}>Back</SecondaryButton>
        <TxSubmissionButton
          getTxFunc={getTxFuncForSubmit}
          onInBlock={handleInBlock}
        />
      </div>
    </div>
  );
}

function RewardsListContent({ onClaimClick }) {
  const realAddress = useRealAddress();
  const { decimals, symbol } = useChainSettings();

  const { result, loading } = useNominatorUnClaimedRewards(realAddress);

  const totalClaimable = result?.totalRewards
    ? toPrecision(result.totalRewards, decimals)
    : "0";

  const hasRewards = result?.result && result.result.length > 0;

  return (
    <div className="space-y-4">
      <SummaryLayout>
        {!loading && (
          <SummaryItem title="Total Claimable">
            <ValueDisplay value={totalClaimable} symbol={symbol} />
          </SummaryItem>
        )}
      </SummaryLayout>

      {loading ? (
        <LoadingContent />
      ) : hasRewards ? (
        <div className="space-y-2 overflow-y-scroll max-h-[400px] scrollbar-pretty">
          {result.result.map((eraData) => (
            <EraRewardItem
              key={eraData.era}
              eraData={eraData}
              onClaimClick={onClaimClick}
            />
          ))}
        </div>
      ) : (
        <div className="text-center text-textTertiary text14Medium py-4">
          No claimable rewards
        </div>
      )}
      <Alerts />
    </div>
  );
}

function ClaimPopupContent() {
  const [selectedEra, setSelectedEra] = useState(null);

  if (selectedEra) {
    return (
      <ClaimEraPopupContent
        eraData={selectedEra}
        onBack={() => setSelectedEra(null)}
      />
    );
  }

  return <RewardsListContent onClaimClick={setSelectedEra} />;
}

// TODO: move data to panel(context: data、refetch)
export default function ClaimPopup({ onClose }) {
  return (
    <SignerPopupWrapper onClose={onClose}>
      <Popup title="Claim Rewards" onClose={onClose}>
        <ClaimPopupContent />
      </Popup>
    </SignerPopupWrapper>
  );
}
