import { cn } from "next-common/utils";
import { forwardRef, useEffect, useRef, useState } from "react";
import _TabsListItem from "./item";
import { useWindowWidthContext } from "next-common/context/windowSize";
import { useRouter } from "next/router";
import { find, isNil } from "lodash-es";
import { GradientBlanket } from "next-common/components/styled/tabList";

const SPACE = 1;

const TabsList = forwardRef(TabsListImpl);
export default TabsList;

/**
 * @param {TabsList} props
 */
function TabsListImpl(
  { tabs = [], activeTabValue, onTabClick, className = "" },
  ref,
) {
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);
  const listRef = useRef();
  const width = useWindowWidthContext();

  function handleGradientBlanketVisible(target) {
    const { scrollLeft, scrollWidth, clientWidth } = target;
    const scrollSpace = scrollWidth - clientWidth;

    setShowLeft(scrollLeft > SPACE);
    setShowRight(scrollLeft < scrollSpace - SPACE);
  }

  useEffect(() => {
    if (listRef.current) {
      handleGradientBlanketVisible(listRef.current);
    }
  }, [listRef, width]);

  function onScroll(event) {
    const target = event.target;
    handleGradientBlanketVisible(target);
  }

  return (
    <div ref={ref} className={cn("relative", "flex items-center", className)}>
      <GradientBlanket className={cn(showLeft && "opacity-100")} />
      <GradientBlanket reversed className={cn(showRight && "opacity-100")} />

      <div
        ref={listRef}
        onScroll={onScroll}
        className="grow flex space-x-6 overflow-x-auto scrollbar-hidden"
      >
        {tabs?.map((tab) => (
          <TabsListItem
            key={tab.value}
            activeTabValue={activeTabValue}
            tab={tab}
            onClick={() => {
              onTabClick?.(tab);
            }}
          />
        ))}
      </div>

      {find(tabs, { value: activeTabValue })?.extra}
    </div>
  );
}

function isTabUrlMatchRouterPath(tab, router) {
  const routerPathWithQuery = router.asPath;
  const [routePath] = routerPathWithQuery.split("?");

  const anyMatch = (tab.noMatchUrls || []).some(
    (url) => routerPathWithQuery === url,
  );

  if (anyMatch) {
    return false;
  }

  if (tab.exactMatch === false) {
    return routePath.startsWith(tab.root || tab.url);
  }

  const urls = [tab.url, tab.root, ...(tab.urls || [])].filter(Boolean);
  return urls.includes(tab.matchWithQuery ? routerPathWithQuery : routePath);
}

function isActiveTab(tab, activeTabValue, router) {
  if (!tab.url) {
    return activeTabValue === tab.value;
  }

  if (isNil(tab.active)) {
    return isTabUrlMatchRouterPath(tab, router);
  }

  return tab.active;
}

function TabsListItem({ tab, activeTabValue, onClick }) {
  const router = useRouter();
  const active = isActiveTab(tab, activeTabValue, router);
  return (
    <_TabsListItem key={tab.value} {...tab} active={active} onClick={onClick} />
  );
}
