import { useEffect, useRef, useState } from "react";
import SecondaryButton from "./lib/button/secondary";
import { cn } from "./utils";

export default function ToggleCollapsed({
  children,
  collapsedHeight = 640,
  moreLessHeightThreshold = 2000,
}) {
  // assume is long content by default to AVOID flicker
  const [collapsed, setCollapsed] = useState(true);
  const ref = useRef(null);
  const [showToggleButton, setShowToggleButton] = useState(false);

  useEffect(() => {
    const shouldCollapse =
      ref.current?.clientHeight >= collapsedHeight &&
      ref.current?.scrollHeight > moreLessHeightThreshold;

    setCollapsed(shouldCollapse);
    setShowToggleButton(shouldCollapse);
  }, [ref, collapsedHeight, moreLessHeightThreshold]);

  return (
    <div
      ref={ref}
      className={cn(
        "flex flex-col",
        "relative",
        collapsed && "overflow-hidden",
      )}
      style={{
        maxHeight: collapsed ? collapsedHeight : "none",
      }}
    >
      {children}

      {showToggleButton && (
        <div
          className={cn(
            "flex justify-center",
            "absolute bottom-0 right-0 left-0",
            !collapsed && "!static",
            collapsed
              ? "pt-12 pb-4 bg-gradient-to-b from-transparent via-neutral100-80 to-neutral100"
              : "mt-4",
          )}
        >
          <SecondaryButton
            size="small"
            onClick={() => {
              setCollapsed(!collapsed);
            }}
          >
            Show {collapsed ? "More" : "Less"}
          </SecondaryButton>
        </div>
      )}
    </div>
  );
}
