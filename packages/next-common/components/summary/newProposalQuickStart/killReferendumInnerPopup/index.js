import { usePopupParams } from "next-common/components/popupWithSigner/context";
import SignerWithBalance from "next-common/components/signerPopup/signerWithBalance";
import Popup from "next-common/components/popup/wrapper/Popup";
import useReferendumIndexField from "next-common/components/preImages/createPreimagePopup/fields/useReferendumIndexField";
import useTrackField from "../common/useTrackField";
import useEnactmentBlocksField from "../common/useEnactmentBlocksField";
import AdvanceSettings from "../common/advanceSettings";
import SubmissionDeposit from "../../newProposalPopup/submissionDeposit";
import SignerPopupWrapper from "next-common/components/popupWithSigner/signerPopupWrapper";
import TxSubmissionButton, {
  useTxSubmissionButton,
} from "next-common/components/common/tx/txSubmissionButton";
import { getEventData } from "next-common/utils/sendTransaction";
import { useRouter } from "next/router";
import { useReferendaProposalOrigin } from "../../newProposalPopup";
import { useCallback } from "react";
import { useContextApi } from "next-common/context/api";
import { usePageProps } from "next-common/context/page";
import { useStepContainer } from "next-common/context/stepContainer";
import Button from "next-common/lib/button";
import CircleStepper from "next-common/components/step";
function useReferendumKillerTrackID() {
  const { tracks } = usePageProps();
  const track = tracks.find((item) => item.name === "referendum_killer");
  if (!track) {
    throw new Error("Referendum killer track not found");
  }
  return track.id;
}

export function KillReferendumInnerPopup({
  referendumIndex: defaultReferendumIndex,
}) {
  const api = useContextApi();
  const router = useRouter();
  const { onClose } = usePopupParams();
  const { value: referendumIndex, component: referendumIndexField } =
    useReferendumIndexField({ defaultReferendumIndex });
  const referendumKillerTrackId = useReferendumKillerTrackID();
  const { value: trackId, component: trackField } = useTrackField(
    referendumKillerTrackId,
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
  }, [api, referendumIndex, enactment, proposalOrigin]);

  return (
    <Popup title="Kill a referendum" onClose={onClose}>
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

export default function KillReferendumPopup({ referendumIndex, onClose }) {
  return (
    <SignerPopupWrapper onClose={onClose}>
      <KillReferendumInnerPopup referendumIndex={referendumIndex} />
    </SignerPopupWrapper>
  );
}

export function KillReferendumInnerPopupContent() {
  const api = useContextApi();
  const router = useRouter();
  const { value: referendumIndex, component: referendumIndexField } =
    useReferendumIndexField({});
  const referendumKillerTrackId = useReferendumKillerTrackID();
  const { value: trackId, component: trackField } = useTrackField(
    referendumKillerTrackId,
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
  }, [api, referendumIndex, enactment, proposalOrigin]);
  const { goBack } = useStepContainer();
  const {
    isLoading,
    component: submitButton,
    loadingTip,
  } = useTxSubmissionButton({
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
      {loadingTip}
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
