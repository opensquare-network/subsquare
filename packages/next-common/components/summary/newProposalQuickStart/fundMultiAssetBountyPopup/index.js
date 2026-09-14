import { useState } from "react";
import { usePageProps } from "next-common/context/page";
import { useStepContainer } from "next-common/context/stepContainer";
import SignerWithBalance from "next-common/components/signerPopup/signerWithBalance";
import useUSDxBalanceField from "next-common/components/preImages/createPreimagePopup/fields/useUSDxBalanceField";
import useAddressComboField from "next-common/components/preImages/createPreimagePopup/fields/useAddressComboField";
import TextAreaField from "next-common/components/popup/fields/textAreaField";
import PopupLabel from "next-common/components/popup/label";
import Input from "next-common/lib/input";
import Tab from "next-common/components/tab";
import CircleStepper from "next-common/components/step";
import { useNewReferendumMultiStepButton } from "next-common/hooks/useNewReferendumMultiStepButton";
import SubmissionDeposit from "../../newProposalPopup/submissionDeposit";
import PreviousButton from "../../newProposalButton/previousButton";
import ErrorInfoPanel from "../../styled/errorInfoPanel";
import AdvanceSettings from "../common/advanceSettings";
import useTrackField from "../common/useTrackField";
import useEnactmentBlocksField from "../common/useEnactmentBlocksField";
import InsufficientBalanceTips from "../common/insufficientBalanceTips";
import SigningTip from "../common/signingTip";
import useFundBountyPreimages from "./useFundBountyPreimages";

const metadataTabs = [
  { tabId: "text", tabTitle: "Text" },
  { tabId: "metadata", tabTitle: "Metadata Hash" },
];

export default function FundMultiAssetBountyReferendumInnerPopupContent() {
  const { goBack } = useStepContainer();
  const { tracks } = usePageProps();
  const {
    value: [inputBalance, symbol],
    component: usdxBalanceField,
  } = useUSDxBalanceField();
  const [inputMode, setInputMode] = useState("text");
  const [description, setDescription] = useState("");
  const [inputMetadataHash, setInputMetadataHash] = useState("");
  const { value: curator, component: curatorField } = useAddressComboField({
    title: "Curator",
  });
  const { value: trackId, component: trackField } = useTrackField(
    tracks.find((track) => track.name === "treasurer")?.id,
  );
  const { value: enactment, component: enactmentField } =
    useEnactmentBlocksField(trackId);
  const {
    encodedHash,
    encodedLength,
    notePreimageTx,
    preimageExists,
    proposalByteLength,
    isPreparing,
    error,
  } = useFundBountyPreimages({
    symbol,
    inputBalance,
    curator,
    inputMode,
    description,
    inputMetadataHash,
  });
  const { isLoading, component: submitButton } =
    useNewReferendumMultiStepButton({
      trackId,
      enactment,
      encodedHash,
      encodedLength,
      notePreimageTx,
      preimageExists,
      disabled: isPreparing || !!error || trackId == null,
      buttonText: "Submit",
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
      {usdxBalanceField}
      {curatorField}
      <div className="flex flex-col gap-3">
        <PopupLabel text="Metadata" />
        <Tab
          tabs={metadataTabs}
          selectedTabId={inputMode}
          setSelectedTabId={setInputMode}
        />
        {inputMode === "text" ? (
          <TextAreaField
            title="Description"
            placeholder="Please fill the description about this bounty..."
            text={description}
            setText={setDescription}
          />
        ) : (
          <div>
            <Input
              placeholder="0x..."
              value={inputMetadataHash}
              onChange={(event) => setInputMetadataHash(event.target.value)}
            />
            <p className="mt-2 text12Medium text-textTertiary">
              The metadata preimage must already exist on chain.
            </p>
          </div>
        )}
      </div>
      {trackField}
      <AdvanceSettings>
        {enactmentField}
        <SubmissionDeposit />
      </AdvanceSettings>
      {isPreparing && (
        <p className="text12Medium text-textTertiary">Checking preimages...</p>
      )}
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
