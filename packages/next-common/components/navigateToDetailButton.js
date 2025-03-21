import { ArrowRight } from "@osn/icons/subsquare";
import { cn } from "next-common/utils";
import Link from "next/link";

export default function NavigateToDetailButton({ href }) {
  return (
    <Link
      href={href}
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
