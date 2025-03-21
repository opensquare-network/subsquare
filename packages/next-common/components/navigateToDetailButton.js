import { ArrowRight } from "@osn/icons/subsquare";
import { useCollectivesSection } from "next-common/context/collectives/collectives";
import { cn } from "next-common/utils";
import Link from "next/link";

export default function NavigateToDetailButton({ address }) {
  const section = useCollectivesSection();
  return (
    <Link
      href={`/${section}/members/${address}`}
      className={cn(
        "cursor-pointer p-[6px]",
        "rounded-[4px] border border-neutral400 hover:border-neutral500",
        "[&_svg_path]stroke-textPrimary",
      )}
    >
      <ArrowRight width={16} height={16} />
    </Link>
  );
}
