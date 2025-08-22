"use client";
import { useReferendaDv } from "next-common/context/referenda/dv";
import { cn } from "next-common/utils";
import { usePageProps } from "next-common/context/page";
import { isNil } from "lodash-es";
import Select from "next-common/components/select";

function CountBySelectImpl() {
  const { countType, setCountType } = useReferendaDv();
  const { cohort } = usePageProps();
  if (isNil(cohort) || isNil(countType)) {
    return null;
  }

  const switchTabs = [
    {
      value: "track",
      label: <span role="button">Only DV tracks referenda</span>,
    },
    {
      value: "referenda",
      label: <span role="button">All referenda</span>,
    },
  ];
  return (
    <div className="flex items-center gap-x-2 text12Medium text-textSecondary">
      Count By
      <Select
        small
        value={countType}
        options={switchTabs}
        onChange={(item) => setCountType(item.value)}
        className="w-[200px] bg-neutral300 text12Medium"
      />
    </div>
  );
}

export default function CountBySelect({
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
      {showSwitch && <CountBySelectImpl />}
    </div>
  );
}
