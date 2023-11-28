import { cn } from "next-common/utils";
import noop from "lodash.noop";
import List from "../tabsList";
import { useState } from "react";

const SPACE = 1;

export default function TabsList({
  tabs = [],
  activeTabLabel,
  onTabClick = noop,
  ...props
}) {
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);

  function onScroll(event) {
    const target = event.target;
    const { scrollLeft, scrollWidth, clientWidth } = target;
    const scrollSpace = scrollWidth - clientWidth;

    setShowLeft(scrollLeft > SPACE);
    setShowRight(scrollLeft < scrollSpace - SPACE);
  }

  return (
    <div className="relative">
      <GradientBlanket className={cn(showLeft && "opacity-100")} />
      <GradientBlanket reversed className={cn(showRight && "opacity-100")} />

      <List
        onScroll={onScroll}
        {...props}
        onTabClick={onTabClick}
        tabs={tabs.map((tab) => {
          const itemClassName = cn(
            "block whitespace-nowrap pb-3",
            "text14Bold border-b-4 text-textPrimary",
            "hover:text-theme500",
          );
          const itemActiveClassName = "border-theme500 text-theme500";
          const active = tab.active ?? activeTabLabel === tab.label;

          return {
            ...tab,
            render() {
              return (
                <div
                  className={cn(
                    itemClassName,
                    active ? itemActiveClassName : "border-transparent",
                  )}
                >
                  {tab.label}
                  {!!tab.activeCount && (
                    <span className="ml-1 text-textTertiary text14Medium">
                      {tab.activeCount}
                    </span>
                  )}
                  {tab.labelExtra}
                </div>
              );
            },
          };
        })}
      />
    </div>
  );
}

function GradientBlanket({ className = "", reversed = false }) {
  return (
    <div
      className={cn(
        "absolute inset-y-0 w-24 pointer-events-none",
        "bg-gradient-to-r from-white to-transparent dark:from-[#212433]",
        "transition-opacity delay-0",
        "opacity-0",
        !reversed ? "left-0" : "right-0",
        reversed && "rotate-180",
        className,
      )}
    />
  );
}
