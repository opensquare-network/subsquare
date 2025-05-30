import { isNil } from "lodash-es";
import useTrackDetail from "next-common/components/summary/newProposalPopup/useTrackDetail";
import Tooltip from "next-common/components/tooltip";

export default function TrackDescriptionTooltip({ trackId, children }) {
  const trackDetail = useTrackDetail(trackId);

  if (isNil(trackDetail?.description) || isNil(trackId)) {
    return children;
  }

  return <Tooltip content={trackDetail?.description}>{children}</Tooltip>;
}
