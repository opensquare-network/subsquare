import { useCallback, useEffect, useState } from "react";
import { getEventData } from "next-common/utils/sendTransaction";
import { isNil } from "lodash-es";
import { useRouter } from "next/router";
import { isValidPreimageHash } from "next-common/utils";
import usePreimageLength from "next-common/hooks/usePreimageLength";
import SubmissionDeposit from "../newProposalPopup/submissionDeposit";
import PreimageField from "../newProposalPopup/preimageField";
import EnactmentBlocks from "../newProposalPopup/enactmentBlocks";
import DetailedFellowshipTrack from "next-common/components/popup/fields/detailedFellowshipTrackField";
import { usePopupParams } from "next-common/components/popupWithSigner/context";
import SignerWithBalance from "next-common/components/signerPopup/signerWithBalance";
import { useContextApi } from "next-common/context/api";
import Popup from "next-common/components/popup/wrapper/Popup";
import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import AdvanceSettings from "next-common/components/summary/newProposalQuickStart/common/advanceSettings";
import EstimatedGas from "next-common/components/estimatedGas";
import {
  useCollectivesContext,
  useReferendaFellowshipPallet,
} from "next-common/context/collectives/collectives";
import { useProposalOrigin } from "../newProposalPopup";

export function NewFellowshipProposalInnerPopup({
  track: _track,
  preimageHash: _preimageHash,
  preimageLength: _preimageLength,
}) {
  const { onClose } = usePopupParams();
  const api = useContextApi();
  const router = useRouter();
  const { section } = useCollectivesContext();
  const pallet = useReferendaFellowshipPallet();

  const [enactment, setEnactment] = useState();
  const [preimageHash, setPreimageHash] = useState(_preimageHash || "");
  const [preimageLength, setPreimageLength] = useState(_preimageLength || "");

  const [trackId, setTrackId] = useState(_track?.id);
  const proposalOrigin = useProposalOrigin(trackId);
  const disabled =
    isNil(trackId) ||
    isNil(enactment) ||
    !preimageHash ||
    !isValidPreimageHash(preimageHash) ||
    !preimageLength;

  const length = usePreimageLength(preimageHash);
  useEffect(() => {
    if (length) {
      setPreimageLength(length);
    }
  }, [length]);

  const getTxFunc = useCallback(() => {
    if (!api) {
      return;
    }

    if (!proposalOrigin) {
      throw new Error("Proposal origin is not set correctly");
    }

    return api.tx[pallet].submit(
      proposalOrigin,
      {
        Lookup: {
          hash: preimageHash,
          len: parseInt(preimageLength),
        },
      },
      enactment,
    );
  }, [api, proposalOrigin, pallet, preimageHash, preimageLength, enactment]);

  return (
    <Popup title="New Proposal" onClose={onClose}>
      <SignerWithBalance supportedMultisig={false} />
      <DetailedFellowshipTrack trackId={trackId} setTrackId={setTrackId} />
      <PreimageField
        preimageHash={preimageHash}
        preimageLength={preimageLength}
        setPreimageHash={setPreimageHash}
        setPreimageLength={setPreimageLength}
      />
      <AdvanceSettings>
        <EnactmentBlocks setEnactment={setEnactment} />
        <SubmissionDeposit pallet={pallet} />
        <EstimatedGas getTxFunc={getTxFunc} />
      </AdvanceSettings>
      <TxSubmissionButton
        getTxFunc={getTxFunc}
        disabled={disabled}
        onInBlock={({ events }) => {
          const eventData = getEventData(events, pallet, "Submitted");
          if (!eventData) {
            return;
          }
          const [referendumIndex] = eventData;
          router.push(`/${section}/referenda/${referendumIndex}`);
        }}
      />
    </Popup>
  );
}
