import { cn } from "next-common/utils";
import Divider from "../styled/layout/divider";
import TabsList from "./tabsList";
import { noop } from "lodash-es";
import { useEffect, useState } from "react";

export default function Tabs({
  tabs = [],
  activeTabLabel = "",
  onTabClick = noop,
  isUrlTabs = false,
}) {
  const [lazyRendered, setLazyRendered] = useState({});

  useEffect(() => {
    if (lazyRendered[activeTabLabel]) {
      return;
    }

    setLazyRendered((v) => ({
      ...v,
      [activeTabLabel]: true,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTabLabel]);

  useEffect(() => {
    return () => {
      setLazyRendered({});
    };
  }, []);

  return (
    <div>
      <TabsList
        tabs={tabs}
        activeTabLabel={activeTabLabel}
        onTabClick={onTabClick}
        isUrlTabs={isUrlTabs}
      />

      <Divider />

      <div className="mt-4 flex">
        {tabs.map(
          (tab, idx) =>
            (lazyRendered[tab.label] || !tab.lazy) && (
              <div
                key={tab.value ?? idx}
                className={cn(
                  "w-full",
                  "hidden",
                  activeTabLabel === tab.label && "!block",
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
