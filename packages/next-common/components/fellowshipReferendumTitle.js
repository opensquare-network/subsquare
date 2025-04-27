import { useCollectivesContext } from "next-common/context/collectives/collectives";
import useFetch from "next-common/hooks/useFetch";
import { startCase } from "lodash-es";
import { usePageProps } from "next-common/context/page";
import { useMemo } from "react";
import FieldLoading from "next-common/components/icons/fieldLoading";

function useFellowshipTracks() {
  const { section } = useCollectivesContext();
  const { fellowshipTracks, ambassadorTracks } = usePageProps();
  return section === "fellowship" ? fellowshipTracks : ambassadorTracks;
}

function useTrackName(trackId) {
  const tracks = useFellowshipTracks();
  return useMemo(() => {
    const track = (tracks || []).find(({ id }) => id === trackId);
    return track ? track.name : "";
  }, [tracks, trackId]);
}

function useDefaultReferendumTitle(referendumIndex, trackId) {
  const trackName = useTrackName(trackId);
  return `[${startCase(trackName)}] Referendum #${referendumIndex}`;
}

export default function FellowshipReferendumTitle({
  referendumIndex,
  trackId,
}) {
  const { section } = useCollectivesContext();
  const defaultTitle = useDefaultReferendumTitle(referendumIndex, trackId);
  const { value: detail, loading } = useFetch(
    `/api/${section}/referenda/${referendumIndex}`,
  );
  const title = detail?.title || defaultTitle;

  return (
    <div className="flex items-center gap-[8px]">
      <a
        className="cursor-pointer text-sapphire500"
        href={`/${section}/referenda/${referendumIndex}`}
        target="_blank"
        rel="noreferrer"
      >
        #{referendumIndex}
      </a>
      <span className="text-textTertiary">·</span>
      {loading ? (
        <FieldLoading />
      ) : (
        <span className="text-textPrimary">{title}</span>
      )}
    </div>
  );
}
