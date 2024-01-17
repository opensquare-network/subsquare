import DetailedTrack from "next-common/components/popup/fields/DetailedTrackField";
import SignerPopup from "next-common/components/signerPopup";
import { useCallback, useState } from "react";
import PreimageField from "./preimageField";
import EnactmentBlocks from "./enactmentBlocks";
import { usePageProps } from "next-common/context/page";
import { sendTx } from "next-common/utils/sendTx";
import { useDispatch } from "react-redux";
import useIsMounted from "next-common/utils/hooks/useIsMounted";
import isNil from "lodash.isnil";
import { useRouter } from "next/router";

export default function NewProposalPopup({ onClose }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const isMounted = useIsMounted();
  const { tracks: trackList } = usePageProps();

  const [track, setTrack] = useState(trackList[0]?.id);
  const [enactment, setEnactment] = useState();
  const [preimageHash, setPreimageHash] = useState();
  const [preimageLength, setPreimageLength] = useState();

  const disabled =
    isNil(track) || isNil(enactment) || !preimageHash || !preimageLength;

  const onSubmit = useCallback(
    (api, signerAccount) => {
      if (!api || !signerAccount) {
        return;
      }

      const tx = api.tx.referenda.submit(
        track,
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
      track,
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
      <DetailedTrack track={track} setTrack={setTrack} />
      <PreimageField
        setPreimageHash={setPreimageHash}
        setPreimageLength={setPreimageLength}
      />
      <EnactmentBlocks setEnactment={setEnactment} />
    </SignerPopup>
  );
}
