import DetailedTrack from "next-common/components/popup/fields/DetailedTrackField";
import SignerPopup from "next-common/components/signerPopup";
import { useCallback, useState } from "react";
import PreimageField from "./preimageField";
import EnactmentBlocks from "./enactmentBlocks";
import { usePageProps } from "next-common/context/page";

export default function NewProposalPopup({ onClose }) {
  const { tracks: trackList } = usePageProps();

  const [track, setTrack] = useState(trackList[0]?.id);
  const [enactment, setEnactment] = useState();
  const [preimageHash, setPreimageHash] = useState();
  const [preimageLength, setPreimageLength] = useState();

  const onSubmit = useCallback(() => {
    console.log({
      track,
      enactment,
      preimageHash,
      preimageLength,
    });
  }, [track, enactment, preimageHash, preimageLength]);

  return (
    <SignerPopup
      wide
      title="New Proposal"
      onClose={onClose}
      actionCallback={onSubmit}
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
