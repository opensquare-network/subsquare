import { useCallback, useEffect, useState } from "react";
import { getEventData } from "next-common/utils/sendTx";
import { useDispatch } from "react-redux";
import { isNil } from "lodash-es";
import { useRouter } from "next/router";
import { isValidPreimageHash } from "next-common/utils";
import usePreimageLength from "next-common/hooks/usePreimageLength";
import SubmissionDeposit from "../newProposalPopup/submissionDeposit";
import PreimageField from "../newProposalPopup/preimageField";
import EnactmentBlocks from "../newProposalPopup/enactmentBlocks";
import DetailedFellowshipTrack from "next-common/components/popup/fields/detailedFellowshipTrackField";
import { usePageProps } from "next-common/context/page";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import SignerPopupWrapper from "next-common/components/popupWithSigner/signerPopupWrapper";
import { usePopupParams } from "next-common/components/popupWithSigner/context";
import SignerWithBalance from "next-common/components/signerPopup/signerWithBalance";
import { useContextApi } from "next-common/context/api";
import Popup from "next-common/components/popup/wrapper/Popup";
import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";

function useProposalOrigin(trackId) {
  const { fellowshipTracksDetail } = usePageProps();
  const origins = (fellowshipTracksDetail || []).find(
    (track) => track.id === trackId,
  )?.origins;
  if (Array.isArray(origins)) {
    return origins[0];
  }
  return origins;
}

export function NewFellowshipProposalInnerPopup({
  track: _track,
  preimageHash: _preimageHash,
  preimageLength: _preimageLength,
}) {
  const { onClose } = usePopupParams();
  const api = useContextApi();
  const dispatch = useDispatch();
  const router = useRouter();

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
    if (!proposalOrigin) {
      dispatch(newErrorToast("Proposal origin is not set correctly"));
      return;
    }

    return api.tx.fellowshipReferenda.submit(
      proposalOrigin,
      {
        Lookup: {
          hash: preimageHash,
          len: parseInt(preimageLength),
        },
      },
      enactment,
    );
  }, [dispatch, proposalOrigin, api, preimageHash, preimageLength, enactment]);

  return (
    <Popup wide title="New Proposal" onClose={onClose}>
      <SignerWithBalance />
      <DetailedFellowshipTrack trackId={trackId} setTrackId={setTrackId} />
      <PreimageField
        preimageHash={preimageHash}
        preimageLength={preimageLength}
        setPreimageHash={setPreimageHash}
        setPreimageLength={setPreimageLength}
      />
      <EnactmentBlocks setEnactment={setEnactment} />
      <SubmissionDeposit />
      <TxSubmissionButton
        getTxFunc={getTxFunc}
        onClose={onClose}
        disabled={disabled}
        onInBlock={(events) => {
          const eventData = getEventData(
            events,
            "fellowshipReferenda",
            "Submitted",
          );
          if (!eventData) {
            return;
          }
          const [referendumIndex] = eventData;
          router.push(`/fellowship/referenda/${referendumIndex}`);
        }}
      />
    </Popup>
  );
}

export default function NewFellowshipProposalPopup({
  track: _track,
  onClose,
  preimageHash: _preimageHash,
  preimageLength: _preimageLength,
}) {
  return (
    <SignerPopupWrapper onClose={onClose}>
      <NewFellowshipProposalInnerPopup
        track={_track}
        preimageHash={_preimageHash}
        preimageLength={_preimageLength}
      />
    </SignerPopupWrapper>
  );
}
