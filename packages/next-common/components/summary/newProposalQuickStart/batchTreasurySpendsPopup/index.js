import SubmissionDeposit from "../../newProposalPopup/submissionDeposit";
import { useCreateProposalSubmitButton } from "../common/createProposalSubmitButton";
import AdvanceSettings from "../common/advanceSettings";
import useEnactmentBlocksField from "../common/useEnactmentBlocksField";
import { useStepContainer } from "next-common/context/stepContainer";
import CircleStepper from "next-common/components/step";
import SigningTip from "../common/signingTip";
import InsufficientBalanceTips from "../common/insufficientBalanceTips";
import PreviousButton from "../../newProposalButton/previousButton";
import {
  useBatchSpendInputs,
  useBatchTreasurySpendsNotePreimageTx,
} from "next-common/components/preImages/createPreimagePopup/templates/batchTreasurySpendPopup";
import useAutoSelectTreasuryTrackField from "../common/useAutoSelectTreasuryTrackField";
import { getTokenAmount } from "../createUSDxTreasuryProposalPopup";
import { useChainSettings } from "next-common/context/chain";

function useTotalValue(spendInputs) {
  const { symbol: chainSymbol } = useChainSettings();
  return spendInputs.reduce((total, item) => {
    if (["USDC", "USDT"].includes(item.symbol)) {
      return total + getTokenAmount(item.inputBalance);
    }
    if (item.symbol === chainSymbol) {
      return total + Number(item.inputBalance || 0);
    }
    throw new Error(`Unsupported asset symbol: ${item.symbol}`);
  }, 0);
}

export function BatchTreasurySpendsReferendumInnerPopupContent() {
  const { goBack } = useStepContainer();

  const { spendInputs, component: batchSpendInputsComponent } =
    useBatchSpendInputs();
  const totalValue = useTotalValue(spendInputs);
  const { value: trackId, component: trackField } =
    useAutoSelectTreasuryTrackField(totalValue);
  const { value: enactment, component: enactmentField } =
    useEnactmentBlocksField(trackId);

  const { encodedHash, encodedLength, notePreimageTx } =
    useBatchTreasurySpendsNotePreimageTx(spendInputs);
  const { isLoading, component: submitButton } = useCreateProposalSubmitButton({
    trackId,
    enactment,
    encodedHash,
    encodedLength,
    notePreimageTx,
  });

  return (
    <>
      <CircleStepper
        steps={[
          {
            id: "templateSelect",
            label: "Template Select",
          },
          { id: "newReferendum", label: "New Referendum" },
        ]}
        currentStep={1}
        loading={isLoading}
      />
      {batchSpendInputsComponent}
      {trackField}
      <AdvanceSettings>
        {enactmentField}
        <SubmissionDeposit />
      </AdvanceSettings>
      <InsufficientBalanceTips byteLength={encodedLength} />
      <SigningTip />
      <div className="flex justify-between">
        <PreviousButton isLoading={isLoading} onClick={goBack} />
        {submitButton}
      </div>
    </>
  );
}
