import { useState } from "react";
import EnactmentBlocks from "../../newProposalPopup/enactmentBlocks";
import useTrackDetail from "../../newProposalPopup/useTrackDetail";

export default function useEnactmentBlocksField(trackId) {
  const [enactment, setEnactment] = useState();
  const track = useTrackDetail(trackId);

  return {
    value: enactment,
    component: <EnactmentBlocks track={track} setEnactment={setEnactment} />,
  };
}
