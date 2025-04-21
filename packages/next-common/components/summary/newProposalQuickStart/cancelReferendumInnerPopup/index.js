import { usePopupParams } from "next-common/components/popupWithSigner/context";
import SignerWithBalance from "next-common/components/signerPopup/signerWithBalance";
import Popup from "next-common/components/popup/wrapper/Popup";
import useReferendumIndexField from "next-common/components/preImages/createPreimagePopup/fields/useReferendumIndexField";
import useTrackField from "../common/useTrackField";
import useEnactmentBlocksField from "../common/useEnactmentBlocksField";
import AdvanceSettings from "../common/advanceSettings";
import SubmissionDeposit from "../../newProposalPopup/submissionDeposit";
import SignerPopupWrapper from "next-common/components/popupWithSigner/signerPopupWrapper";
import { useCallback } from "react";
import { useContextApi } from "next-common/context/api";
import { useReferendaProposalOrigin } from "../../newProposalPopup";
import TxSubmissionButton, {
  useTxSubmissionButton,
} from "next-common/components/common/tx/txSubmissionButton";
import { getEventData } from "next-common/utils/sendTransaction";
import { useRouter } from "next/router";
import { usePageProps } from "next-common/context/page";
import { useStepContainer } from "next-common/context/stepContainer";
import Button from "next-common/lib/button";
import CircleStepper from "next-common/components/step";
function useReferendumCancellerTrackID() {
  const { tracks } = usePageProps();
  const track = tracks.find((item) => item.name === "referendum_canceller");
  if (!track) {
    throw new Error("Referendum canceller track not found");
  }
  return track.id;
}

export function CancelReferendumInnerPopup({
  referendumIndex: defaultReferendumIndex,
}) {
  const router = useRouter();
  const api = useContextApi();
  const { onClose } = usePopupParams();
  const { value: referendumIndex, component: referendumIndexField } =
    useReferendumIndexField({ defaultReferendumIndex });
  const referendumCancellerTrackId = useReferendumCancellerTrackID();
  const { value: trackId, component: trackField } = useTrackField(
    referendumCancellerTrackId,
  );
  const { value: enactment, component: enactmentField } =
    useEnactmentBlocksField(trackId);
  const proposalOrigin = useReferendaProposalOrigin(trackId);

  const getTxFunc = useCallback(async () => {
    if (!api) {
      return;
    }

    const proposal = api.tx.referenda.cancel(referendumIndex);
    return api.tx.referenda.submit(
      proposalOrigin,
      { Inline: proposal.method.toHex() },
      enactment,
    );
  }, [api, referendumIndex, proposalOrigin, enactment]);

  return (
    <Popup title="Cancel a referendum" onClose={onClose}>
      <SignerWithBalance />
      {referendumIndexField}
      {trackField}
      <AdvanceSettings>
        {enactmentField}
        <SubmissionDeposit />
      </AdvanceSettings>
      <div className="flex justify-end">
        <TxSubmissionButton
          getTxFunc={getTxFunc}
          onInBlock={({ events }) => {
            const eventData = getEventData(events, "referenda", "Submitted");
            if (!eventData) {
              return;
            }
            const [referendumIndex] = eventData;
            router.push(`/referenda/${referendumIndex}`);
          }}
        />
      </div>
    </Popup>
  );
}

export default function CancelReferendumPopup({ referendumIndex, onClose }) {
  return (
    <SignerPopupWrapper onClose={onClose}>
      <CancelReferendumInnerPopup referendumIndex={referendumIndex} />;
    </SignerPopupWrapper>
  );
}

export function CancelReferendumInnerPopupContent() {
  const router = useRouter();
  const api = useContextApi();
  const { value: referendumIndex, component: referendumIndexField } =
    useReferendumIndexField({});
  const referendumCancellerTrackId = useReferendumCancellerTrackID();
  const { value: trackId, component: trackField } = useTrackField(
    referendumCancellerTrackId,
  );
  const { value: enactment, component: enactmentField } =
    useEnactmentBlocksField(trackId);
  const proposalOrigin = useReferendaProposalOrigin(trackId);

  const getTxFunc = useCallback(async () => {
    if (!api) {
      return;
    }

    const proposal = api.tx.referenda.cancel(referendumIndex);
    return api.tx.referenda.submit(
      proposalOrigin,
      { Inline: proposal.method.toHex() },
      enactment,
    );
  }, [api, referendumIndex, proposalOrigin, enactment]);
  const { goBack } = useStepContainer();
  const { isLoading, component: submitButton } = useTxSubmissionButton({
    getTxFunc,
    onInBlock: ({ events }) => {
      const eventData = getEventData(events, "referenda", "Submitted");
      if (!eventData) {
        return;
      }
      const [referendumIndex] = eventData;
      router.push(`/referenda/${referendumIndex}`);
    },
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
      <SignerWithBalance />
      {referendumIndexField}
      {trackField}
      <AdvanceSettings>
        {enactmentField}
        <SubmissionDeposit />
      </AdvanceSettings>
      <div className="bg-neutral200 rounded-lg px-4 py-2.5 text14Medium">
        After submitting the transaction, you&apos;ll be redirected to the
        referendum detail page to edit content.
      </div>
      <div className="flex justify-between">
        <Button
          className={`border-neutral400 hover:border-neutral500 ${
            isLoading
              ? " cursor-not-allowed text-textDisabled border-neutral300"
              : ""
          }`}
          disabled={isLoading}
          onClick={goBack}
        >
          Previous
        </Button>
        {submitButton}
      </div>
    </>
  );
}
