import { cn } from "next-common/utils";
import Divider from "../styled/layout/divider";
import TabsList from "./tabsList";
import noop from "lodash.noop";
import { useEffect, useState } from "react";

export default function Tabs({
  tabs = [],
  activeTabLabel = "",
  onTabClick = noop,
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
      />

      <Divider />

      <div className="mt-4 flex">
        {tabs.map(
          (tab, idx) =>
            (lazyRendered[tab.label] || !tab.lazy) && (
              <div
                key={idx}
                className={cn(
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
