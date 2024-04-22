import SignerPopup from "next-common/components/signerPopup";
import { useCallback, useEffect, useMemo, useState } from "react";
import PreimageField from "./preimageField";
import EnactmentBlocks from "./enactmentBlocks";
import { sendTx, wrapWithProxy } from "next-common/utils/sendTx";
import { useDispatch } from "react-redux";
import useIsMounted from "next-common/utils/hooks/useIsMounted";
import { isNil } from "lodash-es";
import { useRouter } from "next/router";
import { usePageProps } from "next-common/context/page";
import SubmissionDeposit from "./submissionDeposit";
import { isValidPreimageHash, upperFirstCamelCase } from "next-common/utils";
import usePreimageLength from "next-common/hooks/usePreimageLength";
import DetailedTrack from "next-common/components/popup/fields/detailedTrackField";
import DetailedFellowshipTrack from "next-common/components/popup/fields/detailedFellowshipTrackField";

export default function NewProposalPopup({
  track: _track,
  onClose,
  preimageHash: _preimageHash,
  preimageLength: _preimageLength,
  module = "referenda",
}) {
  const { tracksDetail } = usePageProps();
  const dispatch = useDispatch();
  const router = useRouter();
  const isMounted = useIsMounted();
  const [isLoading, setIsLoading] = useState(false);

  const [trackId, setTrackId] = useState(_track?.id);
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

      // console.log({ api });

      let proposalOrigin = null;
      if (track?.name === "root") {
        proposalOrigin = { system: "Root" };
      } else {
        proposalOrigin = { Origins: upperFirstCamelCase(track?.name) };
      }

      let tx = api.tx[module].submit(
        proposalOrigin,
        // { system: "Root" },
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
        onInBlock: (eventData) => {
          if (!eventData) {
            return;
          }
          const [referendumIndex] = eventData;
          if (module === "referenda") {
            router.push(`/referenda/${referendumIndex}`);
          } else if (module === "fellowshipReferenda") {
            router.push(`/fellowship/referenda/${referendumIndex}`);
          }
        },
        section: module,
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
      onClose,
      module,
    ],
  );

  let trackSelect = null;
  if (module === "referenda") {
    trackSelect = <DetailedTrack trackId={trackId} setTrackId={setTrackId} />;
  } else if (module === "fellowshipReferenda") {
    trackSelect = (
      <DetailedFellowshipTrack
        title="Track"
        trackId={trackId}
        setTrackId={setTrackId}
      />
    );
  }

  return (
    <SignerPopup
      wide
      title="New Proposal"
      onClose={onClose}
      actionCallback={onSubmit}
      disabled={disabled}
      isLoading={isLoading}
    >
      {trackSelect}
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
