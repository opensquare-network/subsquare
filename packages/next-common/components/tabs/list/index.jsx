import { cn } from "next-common/utils";
import { forwardRef, useEffect, useRef, useState } from "react";
import TabsListItem from "./item";
import { useWindowSize } from "react-use";
import { useRouter } from "next/router";
import { isNil } from "lodash-es";

const SPACE = 1;

const TabsList = forwardRef(TabsListImpl);
export default TabsList;

function TabsListImpl(
  { tabs = [], activeTabValue, onTabClick, className = "" },
  ref,
) {
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);
  const listRef = useRef();
  const { width } = useWindowSize();
  const router = useRouter();
  const [routePath] = router.asPath.split("?");

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
    <div ref={ref} className={cn("relative", className)}>
      <GradientBlanket className={cn(showLeft && "opacity-100")} />
      <GradientBlanket reversed className={cn(showRight && "opacity-100")} />

      <div
        ref={listRef}
        role="tablist"
        onScroll={onScroll}
        className="flex space-x-6 overflow-x-auto scrollbar-hidden"
      >
        {tabs?.map((tab) => {
          let active = tab.active;

          // formerly urlTabs
          if (tab.url) {
            if (isNil(active)) {
              if (tab.exactMatch === false) {
                active = routePath.startsWith(tab.root || tab.url);
              } else {
                const urls = [tab.url, tab.root, ...(tab.urls || [])].filter(
                  Boolean,
                );
                active = urls.includes(routePath);
              }
            }
          } else {
            active = activeTabValue === tab.value;
          }

          return (
            <TabsListItem
              key={tab.value}
              {...tab}
              active={active}
              onClick={() => {
                onTabClick?.(tab);
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
