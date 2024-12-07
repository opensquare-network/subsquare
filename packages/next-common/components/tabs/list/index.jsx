import { cn } from "next-common/utils";
import { forwardRef, useEffect, useRef, useState } from "react";
import TabsListItem from "./item";
import { useWindowSize } from "react-use";

const SPACE = 1;

const TabsList = forwardRef(TabsListImpl);
export default TabsList;

function TabsListImpl({ tabs = [], activeTabValue, onTabClick }, ref) {
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);
  const listRef = useRef();
  const { width } = useWindowSize();

  useEffect(() => {
    if (listRef.current) {
      handleGradientBlanketVisible(listRef.current);
    }
  }, [listRef, width]);

  function onScroll(event) {
    const target = event.target;
    handleGradientBlanketVisible(target);
  }

  function handleGradientBlanketVisible(target) {
    const { scrollLeft, scrollWidth, clientWidth } = target;
    const scrollSpace = scrollWidth - clientWidth;

    setShowLeft(scrollLeft > SPACE);
    setShowRight(scrollLeft < scrollSpace - SPACE);
  }

  return (
    <div ref={ref} className="relative">
      <GradientBlanket className={cn(showLeft && "opacity-100")} />
      <GradientBlanket reversed className={cn(showRight && "opacity-100")} />

      <div
        ref={listRef}
        role="tablist"
        onScroll={onScroll}
        className="flex space-x-6 overflow-x-auto scrollbar-hidden"
      >
        {tabs?.map((tab) => {
          return (
            <TabsListItem
              key={tab.value}
              {...tab}
              active={tab.active ?? activeTabValue === tab.value}
              onClick={() => {
                onTabClick(tab);
              }}
            />
          );
        })}
      </div>
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
