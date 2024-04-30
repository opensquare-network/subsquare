import SignerPopup from "next-common/components/signerPopup";
import { useCallback, useEffect, useMemo, useState } from "react";
import PreimageField from "./preimageField";
import EnactmentBlocks from "./enactmentBlocks";
import { getEventData, sendTx, wrapWithProxy } from "next-common/utils/sendTx";
import { useDispatch } from "react-redux";
import useIsMounted from "next-common/utils/hooks/useIsMounted";
import { isNil } from "lodash-es";
import { useRouter } from "next/router";
import { usePageProps } from "next-common/context/page";
import SubmissionDeposit from "./submissionDeposit";
import { isValidPreimageHash, upperFirstCamelCase } from "next-common/utils";
import usePreimageLength from "next-common/hooks/usePreimageLength";
import DetailedTrack from "next-common/components/popup/fields/detailedTrackField";

export function useProposalOrigin(trackId) {
  const { tracksDetail } = usePageProps();
  const origins = (tracksDetail || []).find(
    (track) => track.id === trackId,
  )?.origins;
  if (Array.isArray(origins)) {
    return origins[0];
  }
  return origins;
}

export default function NewProposalPopup({
  track: _track,
  onClose,
  preimageHash: _preimageHash,
  preimageLength: _preimageLength,
}) {
  const { tracksDetail } = usePageProps();
  const dispatch = useDispatch();
  const router = useRouter();
  const isMounted = useIsMounted();
  const [isLoading, setIsLoading] = useState(false);

  const [trackId, setTrackId] = useState(_track?.id);
  const proposalOrigin = useProposalOrigin(trackId);

  const [enactment, setEnactment] = useState();
  const [preimageHash, setPreimageHash] = useState(_preimageHash || "");
  const [preimageLength, setPreimageLength] = useState(_preimageLength || "");

  const track = useMemo(
    () => tracksDetail?.find((track) => track.id === trackId),
    [trackId, tracksDetail],
  );

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

  const onSubmit = useCallback(
    (api, signerAccount) => {
      if (!api || !signerAccount) {
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

      let tx = api.tx.referenda.submit(
        proposalOriginValue,
        {
          Lookup: {
            hash: preimageHash,
            len: parseInt(preimageLength),
          },
        },
        enactment,
      );

      if (signerAccount?.proxyAddress) {
        tx = wrapWithProxy(api, tx, signerAccount.proxyAddress);
      }

      sendTx({
        tx,
        api,
        dispatch,
        isMounted,
        signerAccount,
        setLoading: setIsLoading,
        onInBlock: (events) => {
          const eventData = getEventData(events, "referenda", "Submitted");
          if (!eventData) {
            return;
          }
          const [referendumIndex] = eventData;
          router.push(`/referenda/${referendumIndex}`);
        },
        onClose,
      });
    },
    [
      dispatch,
      router,
      isMounted,
      track?.name,
      proposalOrigin,
      enactment,
      preimageHash,
      preimageLength,
      onClose,
    ],
  );

  return (
    <SignerPopup
      wide
      title="New Proposal"
      onClose={onClose}
      actionCallback={onSubmit}
      disabled={disabled}
      isLoading={isLoading}
    >
      <DetailedTrack trackId={trackId} setTrackId={setTrackId} />
      <PreimageField
        preimageHash={preimageHash}
        preimageLength={preimageLength}
        setPreimageHash={setPreimageHash}
        setPreimageLength={setPreimageLength}
      />
      <EnactmentBlocks track={track} setEnactment={setEnactment} />
      <SubmissionDeposit />
    </SignerPopup>
  );
}
