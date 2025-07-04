import { useCallback, useEffect, useState } from "react";
import PreimageField from "./preimageField";
import EnactmentBlocks from "./enactmentBlocks";
import { getEventData } from "next-common/utils/sendTransaction";
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
import { useListPageType } from "next-common/context/page";
import { listPageCategory } from "next-common/utils/consts/business/category";
import AdvanceSettings from "../newProposalQuickStart/common/advanceSettings";
import { usePreimageWithHash } from "next-common/hooks/usePreimageHashes";
import CallTree from "next-common/components/proposal/callTree";
import Loading from "next-common/components/loading";
import InsufficientBalanceTips from "../newProposalQuickStart/common/insufficientBalanceTips";

export function useProposalOrigin(trackId) {
  const track = useTrackDetail(trackId);
  const origins = track?.origins;
  if (Array.isArray(origins)) {
    return origins[0];
  }
  return origins;
}

export function useReferendaProposalOrigin(trackId) {
  const listPageType = useListPageType();
  const track = useTrackDetail(trackId);
  const origins = useProposalOrigin(trackId);
  if (origins) {
    return origins;
  }

  if (track?.name === "root") {
    return { system: "Root" };
  }
  const trackName = upperFirstCamelCase(track?.name);

  if (listPageType === listPageCategory.FELLOWSHIP_REFERENDA) {
    return { FellowshipOrigins: trackName };
  } else if (listPageType === listPageCategory.AMBASSADOR_REFERENDA) {
    return { AmbassadorOrigins: trackName };
  } else {
    return { Origins: trackName };
  }
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
  const proposalOrigin = useReferendaProposalOrigin(trackId);

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

    return api.tx.referenda.submit(
      proposalOrigin,
      {
        Lookup: {
          hash: preimageHash,
          len: parseInt(preimageLength),
        },
      },
      enactment,
    );
  }, [api, proposalOrigin, preimageHash, preimageLength, enactment]);

  return (
    <Popup title="New Proposal" onClose={onClose}>
      <SignerWithBalance showTransferable />
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
        disabled={disabled}
        onInBlock={({ events }) => {
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
export function useNewProposalInnerPopupContent({
  track: _track,
  preimageHash: _preimageHash,
  preimageLength: _preimageLength,
}) {
  const api = useContextApi();
  const router = useRouter();

  const [trackId, setTrackId] = useState(_track?.id);
  const proposalOrigin = useReferendaProposalOrigin(trackId);

  const [enactment, setEnactment] = useState();
  const [preimageHash, setPreimageHash] = useState(_preimageHash || "");
  const [preimageLength, setPreimageLength] = useState(_preimageLength || "");
  const [info, loading] = usePreimageWithHash(preimageHash);

  useEffect(() => {
    setTrackId(_track?.id);
    setPreimageHash(_preimageHash);
    setPreimageLength(_preimageLength);
  }, [_track, _preimageHash, _preimageLength]);

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

    return api.tx.referenda.submit(
      proposalOrigin,
      {
        Lookup: {
          hash: preimageHash,
          len: parseInt(preimageLength),
        },
      },
      enactment,
    );
  }, [api, proposalOrigin, preimageHash, preimageLength, enactment]);
  return {
    getTxFunc,
    disabled,
    onInBlock: ({ events }) => {
      const eventData = getEventData(events, "referenda", "Submitted");
      if (!eventData) {
        return;
      }
      const [referendumIndex] = eventData;
      router.push(`/referenda/${referendumIndex}`);
    },
    component: (
      <>
        <SignerWithBalance showTransferable />
        <DetailedTrack trackId={trackId} setTrackId={setTrackId} />
        <PreimageField
          preimageHash={preimageHash}
          preimageLength={preimageLength}
          setPreimageHash={setPreimageHash}
          setPreimageLength={setPreimageLength}
        />
        {loading ? (
          <div className="flex justify-center py-[12px]">
            <Loading size={20} />
          </div>
        ) : info?.proposal ? (
          <CallTree call={info?.proposal} />
        ) : null}
        <AdvanceSettings>
          <EnactmentBlocks track={track} setEnactment={setEnactment} />
          <SubmissionDeposit />
        </AdvanceSettings>
        <InsufficientBalanceTips byteLength={preimageLength} />
      </>
    ),
  };
}
