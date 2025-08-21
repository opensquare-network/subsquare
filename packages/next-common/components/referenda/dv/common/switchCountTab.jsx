"use client";
import { useReferendaDv } from "next-common/context/referenda/dv";
import { cn } from "next-common/utils";
import { usePageProps } from "next-common/context/page";
import { isNil } from "lodash-es";
import { TabSwitch } from "next-common/hooks/useTabSwitch";
import { useEffect, useState } from "react";

function formatTabTitle(text = "", total = 0) {
  if (total > 0) {
    return (
      <div className="flex items-center gap-1">
        {text} <span className="text-textTertiary">·</span>{" "}
        <span className="total">{total}</span>
      </div>
    );
  }
  return text;
}

function SwitchCountTabImpl() {
  const { countType, setCountType } = useReferendaDv();
  const { cohort } = usePageProps();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || isNil(cohort) || isNil(countType)) {
    return null;
  }

  const switchTabs = [
    {
      tabId: "referenda",
      tabTitle: formatTabTitle("Referenda", cohort.allReferendaCnt || 0),
    },
    {
      tabId: "track",
      tabTitle: formatTabTitle("Track", cohort.dvTrackReferendaCnt || 0),
    },
  ];
  return (
    <TabSwitch
      value={countType}
      tabs={switchTabs}
      onChange={setCountType}
      className="w-auto bg-neutral300"
      buttonClassName="w-[110px] [&_.total]:text-textTertiary"
    />
  );
}

export default function SwitchCountTab({
  children,
  className = "",
  showSwitch = true,
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-between max-sm:flex-col max-sm:gap-y-3 max-sm:items-start mx-6 min-h-[28px]",
        className,
      )}
    >
      {children}
      {showSwitch && <SwitchCountTabImpl />}
    </div>
  );
}
