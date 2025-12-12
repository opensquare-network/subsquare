import SignerWithBalance from "next-common/components/signerPopup/signerWithBalance";
import SubmissionDeposit from "../../newProposalPopup/submissionDeposit";
import { useCreateProposalSubmitButton } from "../common/createProposalSubmitButton";
import AdvanceSettings from "../common/advanceSettings";
import useAddressComboField from "next-common/components/preImages/createPreimagePopup/fields/useAddressComboField";
import useEnactmentBlocksField from "../common/useEnactmentBlocksField";
import { useStepContainer } from "next-common/context/stepContainer";
import CircleStepper from "next-common/components/step";
import SigningTip from "../common/signingTip";
import InsufficientBalanceTips from "../common/insufficientBalanceTips";
import PreviousButton from "../../newProposalButton/previousButton";
import { useHydrationTreasurySpendPreimageTx } from "next-common/components/preImages/createPreimagePopup/templates/hydrationTreasurySpendPopup";
import { HOLLAR_CURRENCY } from "next-common/utils/consts/hydration";
import useHydrationCurrencyInfo from "next-common/hooks/useHydrationCurrencyInfo";
import { useState } from "react";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import AmountInputWithHint from "next-common/components/popup/fields/amountInputWithHint";
import { TreasuryProvider } from "next-common/context/treasury";
import useTrackField from "../common/useTrackField";

const treasurerTrackId = 5;

function NewHOLLARTreasuryReferendumInnerPopupContentImpl() {
  const { goBack } = useStepContainer();
  const [inputBalance, setInputBalance] = useState("");
  const realAddress = useRealAddress();
  const { value: beneficiary, component: beneficiaryField } =
    useAddressComboField({ defaultAddress: realAddress });
  const { data: currencyInfo, loading } = useHydrationCurrencyInfo(
    HOLLAR_CURRENCY.id,
  );
  const { value: trackId, component: trackField } =
    useTrackField(treasurerTrackId);
  const { value: enactment, component: enactmentField } =
    useEnactmentBlocksField(trackId);

  const { encodedHash, encodedLength, notePreimageTx } =
    useHydrationTreasurySpendPreimageTx(inputBalance, beneficiary);

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
      <SignerWithBalance showTransferable supportedMultisig={false} />
      <AmountInputWithHint
        label="Request"
        hintLabel="Available"
        hintTooltip="Available treasury balance"
        maxAmount={currencyInfo?.treasuryBalance}
        decimals={HOLLAR_CURRENCY.decimals}
        symbol={HOLLAR_CURRENCY.symbol}
        isLoading={loading}
        inputAmount={inputBalance}
        setInputAmount={setInputBalance}
      />
      <div className="flex flex-col gap-[8px]">{beneficiaryField}</div>
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

export function NewHOLLARTreasuryReferendumInnerPopupContent() {
  return (
    <TreasuryProvider>
      <NewHOLLARTreasuryReferendumInnerPopupContentImpl />
    </TreasuryProvider>
  );
}
