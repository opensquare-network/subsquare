import SignerPopup from "next-common/components/signerPopup";
import { useCallback, useEffect, useState } from "react";
import { getEventData, sendTx, wrapWithProxy } from "next-common/utils/sendTx";
import { useDispatch } from "react-redux";
import useIsMounted from "next-common/utils/hooks/useIsMounted";
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

export default function NewFellowshipProposalPopup({
  track: _track,
  onClose,
  preimageHash: _preimageHash,
  preimageLength: _preimageLength,
}) {
  const dispatch = useDispatch();
  const router = useRouter();
  const isMounted = useIsMounted();
  const [isLoading, setIsLoading] = useState(false);

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

  const onSubmit = useCallback(
    (api, signerAccount) => {
      if (!api || !signerAccount) {
        return;
      }

      if (!proposalOrigin) {
        dispatch(newErrorToast("Proposal origin is not set correctly"));
        return;
      }

      let tx = api.tx.fellowshipReferenda.submit(
        proposalOrigin,
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
        },
        onClose,
      });
    },
    [
      dispatch,
      router,
      isMounted,
      enactment,
      preimageHash,
      preimageLength,
      onClose,
      proposalOrigin,
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
      <DetailedFellowshipTrack trackId={trackId} setTrackId={setTrackId} />
      <PreimageField
        preimageHash={preimageHash}
        preimageLength={preimageLength}
        setPreimageHash={setPreimageHash}
        setPreimageLength={setPreimageLength}
      />
      <EnactmentBlocks setEnactment={setEnactment} />
      <SubmissionDeposit />
    </SignerPopup>
  );
}
