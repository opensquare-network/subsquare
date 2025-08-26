"use client";
import { useDvReferenda } from "next-common/context/referenda/dv";
import { cn } from "next-common/utils";
import { usePageProps } from "next-common/context/page";
import { isNil } from "lodash-es";
import Select from "next-common/components/select";
import { TrackReferenda, AllReferenda } from "next-common/context/referenda/dv";

function CountBySelectImpl({ selectClassName = "" }) {
  const { countType, setCountType } = useDvReferenda();
  const { cohort } = usePageProps();
  if (isNil(cohort) || isNil(countType)) {
    return null;
  }

  const switchTabs = [
    {
      value: TrackReferenda,
      label: <span role="button">Only DV tracks referenda</span>,
    },
    {
      value: AllReferenda,
      label: <span role="button">All referenda</span>,
    },
  ];
  return (
    <div
      className={cn(
        "flex items-center gap-x-2 text12Medium text-textSecondary",
        selectClassName,
      )}
    >
      Count by
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
  showSelect = true,
  selectClassName = "",
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-between max-sm:flex-col max-sm:gap-y-3 max-sm:items-start mx-6 min-h-[28px]",
        className,
      )}
    >
      {children}
      {showSelect && <CountBySelectImpl selectClassName={selectClassName} />}
    </div>
  );
}
