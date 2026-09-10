import { ArrowDown } from "@osn/icons/subsquare";
import { cn } from "next-common/utils";
import { useCallback, useEffect, useRef, useState } from "react";
import { useMutationObserver } from "next-common/hooks/useMutationObserver";

// Divider with the "More" toggle in the middle:
//   ────────────  More ⌄  ────────────
function ExpandDivider({ expanded, onClick }) {
  return (
    <button
      type="button"
      aria-expanded={expanded}
      onClick={onClick}
      className={cn(
        "group w-full flex items-center gap-3 py-1",
        "text12Medium text-textTertiary hover:text-textSecondary",
      )}
    >
      <span className="flex-1 h-px bg-neutral300 group-hover:bg-neutral400" />
      <span className="flex items-center gap-1 leading-none">
        More
        <ArrowDown
          width={16}
          height={16}
          className={cn(
            "shrink-0 transition-transform",
            expanded && "rotate-180",
          )}
        />
      </span>
      <span className="flex-1 h-px bg-neutral300 group-hover:bg-neutral400" />
    </button>
  );
}

// Splits an action group into an always visible part (`children`) and a part
// hidden by default (`more`), revealed by clicking the divider below the
// visible content.
//
// The divider is rendered only while the hidden part actually has something to
// show: the incoming components render `null` depending on the on-chain state
// (and on whether a wallet is connected), which would otherwise leave a
// dangling expand toggle revealing nothing. The hidden part stays mounted
// (just visually hidden) so its content can be observed.
export default function SplitMoreContent({ children, more, className }) {
  const [expanded, setExpanded] = useState(false);
  const moreRef = useRef(null);
  const [hasMoreContent, setHasMoreContent] = useState(false);

  const updateHasMoreContent = useCallback(
    () => setHasMoreContent(Boolean(moreRef.current?.childElementCount)),
    [],
  );

  useEffect(updateHasMoreContent);
  useMutationObserver(updateHasMoreContent, moreRef, {
    childList: true,
    subtree: true,
  });

  return (
    <div className={cn("w-full flex flex-col gap-4", className)}>
      {children}

      {hasMoreContent && (
        <ExpandDivider
          expanded={expanded}
          onClick={() => setExpanded((value) => !value)}
        />
      )}

      <div
        ref={moreRef}
        className={cn("flex flex-col gap-4", !expanded && "hidden")}
      >
        {more}
      </div>
    </div>
  );
}
