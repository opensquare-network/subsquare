import { usePageProps } from "next-common/context/page";
import { startCase } from "lodash-es";
import { cn } from "next-common/utils";

export default function Track({ id, className = "" }) {
  const { tracks } = usePageProps();
  const track = tracks.find((track) => track.id === id);

  let content;
  if (!track) {
    content = `[${id}]`;
  } else {
    content = `[${id}] ${startCase(track.name)}`;
  }

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
