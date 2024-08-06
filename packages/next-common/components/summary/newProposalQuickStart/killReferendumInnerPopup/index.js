import { usePopupParams } from "next-common/components/popupWithSigner/context";
import SignerWithBalance from "next-common/components/signerPopup/signerWithBalance";
import Popup from "next-common/components/popup/wrapper/Popup";
import useReferendumIndexField from "next-common/components/preImages/createPreimagePopup/fields/useReferendumIndexField";
import useTrackField from "../common/useTrackField";
import useEnactmentBlocksField from "../common/useEnactmentBlocksField";
import AdvanceSettings from "../common/advanceSettings";
import SubmissionDeposit from "../../newProposalPopup/submissionDeposit";
import SignerPopupWrapper from "next-common/components/popupWithSigner/signerPopupWrapper";
import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import { getEventData } from "next-common/utils/sendTx";
import { useRouter } from "next/router";
import { useReferendaProposalOrigin } from "../../newProposalPopup";
import { useCallback } from "react";
import { useContextApi } from "next-common/context/api";
import Chains from "next-common/utils/consts/chains";
import { useChain } from "next-common/context/chain";

function useReferendumKillerTrackID() {
  const chain = useChain();
  switch (chain) {
    case Chains.polkadot:
    case Chains.kusama:
    case Chains.altair:
      return 21;
    case Chains.basilisk:
      return 3;
    case Chains.bifrost:
    case Chains.bifrostPolkadot:
      return 4;
    default:
      throw new Error("Unsupported chain");
  }
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
  }, [api, referendumIndex, enactment]);

  return (
    <Popup
      title="Kill a referendum"
      className="!w-[640px]"
      onClose={onClose}
      wide
    >
      <SignerWithBalance title="Origin" />
      {referendumIndexField}
      {trackField}
      <AdvanceSettings>
        {enactmentField}
        <SubmissionDeposit />
      </AdvanceSettings>
      <div className="flex justify-end">
        <TxSubmissionButton
          getTxFunc={getTxFunc}
          onClose={onClose}
          onInBlock={(events) => {
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
