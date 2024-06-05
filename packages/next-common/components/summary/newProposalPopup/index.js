import { useCallback, useEffect, useState } from "react";
import PreimageField from "./preimageField";
import EnactmentBlocks from "./enactmentBlocks";
import { getEventData } from "next-common/utils/sendTx";
import { isNil } from "lodash-es";
import { useRouter } from "next/router";
import SubmissionDeposit from "./submissionDeposit";
import { isValidPreimageHash, upperFirstCamelCase } from "next-common/utils";
import usePreimageLength from "next-common/hooks/usePreimageLength";
import DetailedTrack from "next-common/components/popup/fields/detailedTrackField";
import useTrackDetail from "./useTrackDetail";
import SignerWithBalance from "next-common/components/signerPopup/signerWithBalance";
import { useContextApi } from "next-common/context/api";
import { usePopupParams } from "next-common/components/popupWithSigner/context";
import Popup from "next-common/components/popup/wrapper/Popup";
import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";

export function useProposalOrigin(trackId) {
  const track = useTrackDetail(trackId);
  const origins = track?.origins;
  if (Array.isArray(origins)) {
    return origins[0];
  }
  return origins;
}

export function NewProposalInnerPopup({
  track: _track,
  preimageHash: _preimageHash,
  preimageLength: _preimageLength,
}) {
  const api = useContextApi();
  const { onClose } = usePopupParams();
  const router = useRouter();

  const [trackId, setTrackId] = useState(_track?.id);
  const proposalOrigin = useProposalOrigin(trackId);

  const [enactment, setEnactment] = useState();
  const [preimageHash, setPreimageHash] = useState(_preimageHash || "");
  const [preimageLength, setPreimageLength] = useState(_preimageLength || "");

  const track = useTrackDetail(trackId);

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

    let proposalOriginValue = proposalOrigin;

    // When proposal origin is not defined in track detail, we use the track name as origin
    if (!proposalOriginValue) {
      if (track?.name === "root") {
        proposalOriginValue = { system: "Root" };
      } else {
        proposalOriginValue = { Origins: upperFirstCamelCase(track?.name) };
      }
    }

    return api.tx.referenda.submit(
      proposalOriginValue,
      {
        Lookup: {
          hash: preimageHash,
          len: parseInt(preimageLength),
        },
      },
      enactment,
    );
  }, [
    api,
    proposalOrigin,
    track?.name,
    preimageHash,
    preimageLength,
    enactment,
  ]);

  return (
    <Popup wide title="New Proposal" onClose={onClose}>
      <SignerWithBalance />
      <DetailedTrack trackId={trackId} setTrackId={setTrackId} />
      <PreimageField
        preimageHash={preimageHash}
        preimageLength={preimageLength}
        setPreimageHash={setPreimageHash}
        setPreimageLength={setPreimageLength}
      />
      <EnactmentBlocks track={track} setEnactment={setEnactment} />
      <SubmissionDeposit />
      <TxSubmissionButton
        getTxFunc={getTxFunc}
        onClose={onClose}
        disabled={disabled}
        onInBlock={(events) => {
          const eventData = getEventData(events, "referenda", "Submitted");
          if (!eventData) {
            return;
          }
          const [referendumIndex] = eventData;
          router.push(`/referenda/${referendumIndex}`);
        }}
      />
    </Popup>
  );
}
