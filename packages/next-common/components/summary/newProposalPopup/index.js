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
import camelCase from "lodash.camelcase";
import upperFirst from "lodash.upperfirst";
import SubmissionDeposit from "./submissionDeposit";

function isValidPreimageHash(hash) {
  return isHex(hash, 32 * 8);
}

function upperFirstCamelCase(str) {
  return upperFirst(camelCase(str));
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
  const [preimageHash, setPreimageHash] = useState(_preimageHash || "");
  const [preimageLength, setPreimageLength] = useState(_preimageLength || "");

  const track = useMemo(
    () => tracksDetail?.find((track) => track.id === trackId),
    [trackId, tracksDetail],
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

      let proposalOrigin = null;
      if (track?.name === "root") {
        proposalOrigin = { system: "Root" };
      } else {
        proposalOrigin = { Origins: upperFirstCamelCase(track?.name) };
      }

      const tx = api.tx.referenda.submit(
        proposalOrigin,
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
      track?.name,
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
