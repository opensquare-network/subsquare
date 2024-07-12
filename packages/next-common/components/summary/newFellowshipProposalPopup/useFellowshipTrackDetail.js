import { useCollectivesContext } from "next-common/context/collectives/collectives";
import { usePageProps } from "next-common/context/page";
import { useMemo } from "react";

export function useFellowshipTrackDetail(trackId) {
  const { section } = useCollectivesContext();
  const { fellowshipTracksDetail, ambassadorTracksDetail } = usePageProps();

  let tracksDetail;
  if (section === "fellowship") {
    tracksDetail = fellowshipTracksDetail;
  } else if (section === "ambassador") {
    tracksDetail = ambassadorTracksDetail;
  }

  return useMemo(
    () => (tracksDetail || []).find((track) => track.id === trackId),
    [trackId, tracksDetail],
  );
}
