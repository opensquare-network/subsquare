import { usePageProps } from "next-common/context/page";
import { startCase } from "lodash-es";
import { cn } from "next-common/utils";

export function useTrackName(id) {
  const { tracks } = usePageProps();
  const track = tracks.find((track) => track.id === id);
  if (!track) {
    return null;
  }
  return startCase(track.name);
}

export function useTrackContent(id) {
  const { tracks } = usePageProps();
  const track = tracks.find((track) => track.id === id);
  if (!track) {
    return `[${id}]`;
  }
  return `[${id}] ${startCase(track.name)}`;
}

export default function Track({ id, className = "" }) {
  const content = useTrackContent(id);

  return (
    <span
      className={cn(
        "bg-neutral200 py-0.5 px-2 rounded-[10px]",
        "text-textSecondary text12Medium",
        className,
      )}
    >
      {content}
    </span>
  );
}
