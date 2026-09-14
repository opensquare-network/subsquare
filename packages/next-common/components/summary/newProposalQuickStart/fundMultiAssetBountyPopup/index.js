import { useStepContainer } from "next-common/context/stepContainer";
import SignerWithBalance from "next-common/components/signerPopup/signerWithBalance";
import useFundBountyFields from "next-common/components/preImages/createPreimagePopup/fields/useFundBountyFields";
import CircleStepper from "next-common/components/step";
import { useNewReferendumMultiStepButton } from "next-common/hooks/useNewReferendumMultiStepButton";
import SubmissionDeposit from "../../newProposalPopup/submissionDeposit";
import PreviousButton from "../../newProposalButton/previousButton";
import ErrorInfoPanel from "../../styled/errorInfoPanel";
import AdvanceSettings from "../common/advanceSettings";
import useAutoSelectTreasuryTrackField from "../common/useAutoSelectTreasuryTrackField";
import useEnactmentBlocksField from "../common/useEnactmentBlocksField";
import InsufficientBalanceTips from "../common/insufficientBalanceTips";
import SigningTip from "../common/signingTip";
import { useFundBountyPreimages } from "next-common/components/preImages/createPreimagePopup/templates/fundMultiAssetBountyPopup";
import { getTokenAmount } from "../createUSDxTreasuryProposalPopup";

export default function FundMultiAssetBountyReferendumInnerPopupContent() {
  const { goBack } = useStepContainer();
  const { value: bountyParams, component: bountyFields } =
    useFundBountyFields();
  const { value: trackId, component: trackField } =
    useAutoSelectTreasuryTrackField(getTokenAmount(bountyParams.inputBalance));
  const { value: enactment, component: enactmentField } =
    useEnactmentBlocksField(trackId);
  const {
    encodedHash,
    encodedLength,
    notePreimageTx,
    preimageExists,
    proposalByteLength,
    error,
  } = useFundBountyPreimages(bountyParams);
  const { isLoading, component: submitButton } =
    useNewReferendumMultiStepButton({
      trackId,
      enactment,
      encodedHash,
      encodedLength,
      notePreimageTx,
      preimageExists,
      disabled: trackId == null,
    });

  return (
    <>
      <CircleStepper
        steps={[
          { id: "templateSelect", label: "Template Select" },
          { id: "newReferendum", label: "New Referendum" },
        ]}
        currentStep={1}
        loading={isLoading}
      />
      <SignerWithBalance showTransferable supportedMultisig={false} />
      {bountyFields}
      {trackField}
      <AdvanceSettings>
        {enactmentField}
        <SubmissionDeposit />
      </AdvanceSettings>
      {error && <ErrorInfoPanel>{error}</ErrorInfoPanel>}
      <InsufficientBalanceTips byteLength={proposalByteLength} />
      <SigningTip />
      <div className="flex justify-between">
        <PreviousButton isLoading={isLoading} onClick={goBack} />
        {submitButton}
      </div>
    </>
  );
}
