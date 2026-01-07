import { useState, useMemo } from "react";

function ToggleButton({ onClick, children }) {
  return (
    <button
      onClick={onClick}
      className="px-3 py-[6px] text12Medium bg-neutral100 border border-neutral400 rounded-md"
    >
      {children}
    </button>
  );
}

export default function FoldableContent({
  items,
  threshold = 10,
  renderItem = null,
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  const showFoldButton = useMemo(() => {
    return items?.length > threshold;
  }, [items, threshold]);

  const displayItems = useMemo(
    () => (isExpanded ? items : items.slice(0, threshold)),
    [isExpanded, items, threshold],
  );

  return (
    <div>
      <div className="space-y-1">
        {renderItem ? displayItems.map(renderItem) : displayItems}
      </div>
      {showFoldButton ? (
        <div className="flex justify-center mt-4">
          <ToggleButton onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? "Show Less" : "Show More"}
          </ToggleButton>
        </div>
      ) : null}
    </div>
  );
}
