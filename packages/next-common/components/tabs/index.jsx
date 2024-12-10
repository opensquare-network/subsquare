import { cn } from "next-common/utils";
import Divider from "../styled/layout/divider";
import TabsList from "./list";
import { noop } from "lodash-es";
import { useEffect, useState } from "react";

/**
 * @param {Tabs} props
 */
export default function Tabs({
  tabs = [],
  activeTabValue = "",
  onTabClick = noop,
  tabsListDivider = true,
  tabsListClassName = "",
  tabsContentClassName = "",
}) {
  const [lazyRendered, setLazyRendered] = useState({});

  useEffect(() => {
    if (lazyRendered[activeTabValue]) {
      return;
    }

    setLazyRendered((v) => ({
      ...v,
      [activeTabValue]: true,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTabValue]);

  useEffect(() => {
    return () => {
      setLazyRendered({});
    };
  }, []);

  return (
    <div>
      <TabsList
        className={tabsListClassName}
        tabs={tabs}
        activeTabValue={activeTabValue}
        onTabClick={onTabClick}
      />

      {tabsListDivider && <Divider />}

      <div className={cn("mt-4 flex", tabsContentClassName)}>
        {tabs.map(
          (tab, idx) =>
            (lazyRendered[tab.value] || !tab.lazy) && (
              <div
                key={tab.value ?? idx}
                className={cn(
                  "w-full",
                  "hidden",
                  activeTabValue === tab.value && "!block",
                )}
              >
                {tab.content}
              </div>
            ),
        )}
      </div>
    </div>
  );
}
