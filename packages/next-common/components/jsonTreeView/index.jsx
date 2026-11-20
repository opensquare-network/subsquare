import { cn } from "next-common/utils/clsx";
import JsonNode from "./jsonNode";
import { entriesOf, getJsonKind, isContainerKind } from "./kind";

/**
 * Renders arbitrary JSON as a tree, in the same visual language as the call tree
 * (papiCallTreeView): containers fold, values sit in neutral200 boxes.
 *
 * The root container has no box of its own, its entries are rendered as siblings, the
 * way the call tree renders a call's args below the section.method title.
 */
export default function JsonTreeView({ src, className }) {
  const kind = getJsonKind(src);
  const entries = isContainerKind(kind) ? entriesOf(src) : [];

  return (
    <div
      className={cn(
        "flex flex-col gap-[8px] text-[12px] leading-[16px] text-textPrimary",
        className,
      )}
    >
      {entries.length ? (
        entries.map(([key, value]) => (
          <JsonNode key={key} name={key} value={value} />
        ))
      ) : (
        <JsonNode value={src} />
      )}
    </div>
  );
}
