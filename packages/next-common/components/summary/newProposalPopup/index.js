import DetailedTrack from "next-common/components/popup/fields/DetailedTrackField";
import SignerPopup from "next-common/components/signerPopup";
import { useCallback, useEffect, useMemo, useState } from "react";
import PreimageField from "./preimageField";
import EnactmentBlocks from "./enactmentBlocks";
import { sendTx } from "next-common/utils/sendTx";
import { useDispatch } from "react-redux";
import useIsMounted from "next-common/utils/hooks/useIsMounted";
import isNil from "lodash.isnil";
import { useRouter } from "next/router";
import { isHex } from "@polkadot/util";
import useApi from "next-common/utils/hooks/useApi";
import { usePageProps } from "next-common/context/page";

function isValidPreimageHash(hash) {
  return isHex(hash, 32 * 8);
}

export default function NewProposalPopup({
  track: _track,
  onClose,
  preimageHash: _preimageHash,
  preimageLength: _preimageLength,
}) {
  const { tracksDetail } = usePageProps();
  const api = useApi();
  const dispatch = useDispatch();
  const router = useRouter();
  const isMounted = useIsMounted();

  const [trackId, setTrackId] = useState(_track?.id);
  const [enactment, setEnactment] = useState();
  const [preimageHash, setPreimageHash] = useState(_preimageHash);
  const [preimageLength, setPreimageLength] = useState(_preimageLength);

  const track = useMemo(
    () => _track || tracksDetail?.find((track) => track.id === trackId),
    [trackId, _track, tracksDetail],
  );

  const disabled =
    isNil(trackId) || isNil(enactment) || !preimageHash || !preimageLength;

  useEffect(() => {
    if (!preimageHash || !isValidPreimageHash(preimageHash) || !api) {
      return;
    }

    Promise.all([
      api.query.preimage.statusFor?.(preimageHash),
      api.query.preimage.requestStatusFor?.(preimageHash),
    ]).then(([statusFor, requestStatusFor]) => {
      const status =
        statusFor?.unwrapOr(null) || requestStatusFor?.unwrapOr(null);
      if (!status) {
        return;
      }
      setPreimageLength(status.value?.len?.toString());
    });
  }, [api, preimageHash]);

  const onSubmit = useCallback(
    (api, signerAccount) => {
      if (!api || !signerAccount) {
        return;
      }

      const tx = api.tx.referenda.submit(
        trackId,
        {
          Lookup: {
            hash: preimageHash,
            len: parseInt(preimageLength),
          },
        },
        enactment,
      );

      sendTx({
        tx,
        api,
        dispatch,
        isMounted,
        signerAddress: signerAccount.address,
        onInBlock: (eventData) => {
          if (!eventData) {
            return;
          }
          const [referendumIndex] = eventData;
          router.push(`/referenda/${referendumIndex}`);
        },
        section: "referenda",
        method: "Submitted",
        onClose,
      });
    },
    [
      dispatch,
      router,
      isMounted,
      trackId,
      enactment,
      preimageHash,
      preimageLength,
    ],
  );

  return (
    <SignerPopup
      wide
      title="New Proposal"
      onClose={onClose}
      actionCallback={onSubmit}
      disabled={disabled}
    >
      {!_track && <DetailedTrack trackId={trackId} setTrackId={setTrackId} />}
      <PreimageField
        preimageHash={preimageHash}
        preimageLength={preimageLength}
        setPreimageHash={setPreimageHash}
        setPreimageLength={setPreimageLength}
      />
      <EnactmentBlocks track={track} setEnactment={setEnactment} />
    </SignerPopup>
  );
}
