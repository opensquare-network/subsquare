import DetailedTrack from "next-common/components/popup/fields/DetailedTrackField";
import SignerPopup from "next-common/components/signerPopup";
import { useCallback, useEffect, useMemo, useState } from "react";
import PreimageField from "./preimageField";
import EnactmentBlocks from "./enactmentBlocks";
import { sendTx, wrapWithProxy } from "next-common/utils/sendTx";
import { useDispatch } from "react-redux";
import useIsMounted from "next-common/utils/hooks/useIsMounted";
import isNil from "lodash.isnil";
import { useRouter } from "next/router";
import { usePageProps } from "next-common/context/page";
import SubmissionDeposit from "./submissionDeposit";
import { isValidPreimageHash, upperFirstCamelCase } from "next-common/utils";
import usePreimageLength from "next-common/hooks/usePreimageLength";

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

      let proposalOrigin = null;
      if (track?.name === "root") {
        proposalOrigin = { system: "Root" };
      } else {
        proposalOrigin = { Origins: upperFirstCamelCase(track?.name) };
      }

      let tx = api.tx.referenda.submit(
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
