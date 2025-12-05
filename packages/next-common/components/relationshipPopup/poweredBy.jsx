import {
  useRelationshipViewTypeState,
  VIEW_TYPE,
} from "next-common/context/relationship/selectViewType";
import { cn } from "next-common/utils";
import Link from "next-common/components/link";
import SubmergeLogo from "next-common/assets/imgs/icons/submerge-logo.svg";

export default function PoweredBy() {
  const { viewType } = useRelationshipViewTypeState();

  if (viewType !== VIEW_TYPE.TRANSFER) {
    return null;
  }

  return (
    <div
      className={cn(
        "absolute bottom-0 left-[58.5px] z-10",
        "text-textTertiary text-[10px] py-[2px] px-[3px]",
        "bg-[var(--xy-attribution-background-color-default)] text-[#999]",
        "flex items-center gap-x-1",
        "before:content-['.'] before:-ml-[6px]",
      )}
    >
      Data is powered by{" "}
      <Link
        href="https://submerge.io/"
        target="_blank"
        className="inline-flex items-center mt-1"
      >
        <SubmergeLogo className="h-2 block fill-[#999] hover:fill-[var(--textPrimary)]" />
      </Link>
    </div>
  );
}
