import { useCollectivesContext } from "next-common/context/collectives/collectives";
import useFetch from "next-common/hooks/useFetch";
import { startCase } from "lodash-es";
import { usePageProps } from "next-common/context/page";
import { useMemo } from "react";
import FieldLoading from "next-common/components/icons/fieldLoading";
import { cn } from "next-common/utils";

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

export function FellowshipReferendumTitleImpl({
  referendumIndex,
  title = "",
  className = "",
  loading = false,
}) {
  const { section } = useCollectivesContext();
  return (
    <div className={cn("flex items-center gap-[8px]", className)}>
      <span className="text-textPrimary">#{referendumIndex}</span>
      <span className="text-textTertiary">·</span>
      {loading ? (
        <FieldLoading size={14} />
      ) : (
        <a
          className="cursor-pointer text-textPrimary hover:underline"
          href={`/${section}/referenda/${referendumIndex}`}
          target="_blank"
          rel="noreferrer"
        >
          {title}
        </a>
      )}
    </div>
  );
}

export default function FellowshipReferendumTitle({
  referendumIndex,
  trackId,
}) {
  const defaultTitle = useDefaultReferendumTitle(referendumIndex, trackId);

  const { section } = useCollectivesContext();
  const { value: detail, loading } = useFetch(
    `/api/${section}/referenda/${referendumIndex}`,
  );
  const title = detail?.title || defaultTitle;
  return (
    <FellowshipReferendumTitleImpl
      referendumIndex={referendumIndex}
      title={title}
      loading={loading}
    />
  );
}
