import { isNil } from "lodash-es";
import useTrackDetail from "next-common/components/summary/newProposalPopup/useTrackDetail";
import Tooltip from "next-common/components/tooltip";
import { usePageProperties } from "next-common/context/page";
import { supportedTrackPageCategory } from "next-common/utils/consts/business/category";

export function MaybeTrackDescriptionTooltip({ trackId, children }) {
  const { listPageType } = usePageProperties();

  const isSupportedTrackPage = Object.values(
    supportedTrackPageCategory,
  ).includes(listPageType);

  if (isSupportedTrackPage) {
    return (
      <TrackDescriptionTooltip trackId={trackId}>
        {children}
      </TrackDescriptionTooltip>
    );
  }

  return children;
}

export default function TrackDescriptionTooltip({ trackId, children }) {
  const trackDetail = useTrackDetail(trackId);

  if (isNil(trackDetail?.description) || isNil(trackId)) {
    return children;
  }

  return <Tooltip content={trackDetail?.description}>{children}</Tooltip>;
}
