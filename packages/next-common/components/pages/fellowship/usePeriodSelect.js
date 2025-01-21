import {
  useCommittedFilterState,
  useStagedFilterState,
} from "next-common/components/dropdownFilter/context";
import Select from "next-common/components/select";
import {
  addRouterQuery,
  getRouterQuery,
  removeRouterQuery,
} from "next-common/utils/router";
import { useRouter } from "next/router";

export const All = "all";
export const DemotionPeriodAboutToExpire = "demotion_period_about_to_expire";
export const DemotionPeriodExpired = "demotion_period_expired";
export const OffboardClosing = "offboard_closing";
export const Promotable = "promotable";

const options = [
  {
    label: "All status",
    value: All,
  },
  {
    label: "Demotion closing",
    value: DemotionPeriodAboutToExpire,
  },
  {
    label: "Can be demoted",
    value: DemotionPeriodExpired,
  },
  {
    label: "Can be promoted",
    value: Promotable,
  },
].map(({ label, value }) => ({
  label,
  value,
}));

const candidateOptions = [
  {
    label: "All status",
    value: All,
  },
  {
    label: "Offboard closing",
    value: OffboardClosing,
  },
].map(({ label, value }) => ({
  label,
  value,
}));

function PeriodFilterSelect({
  periodFilter,
  setPeriodFilter,
  isCandidate = false,
}) {
  return (
    <div className="flex items-center justify-between gap-[8px]">
      <span className="text12Medium text-textPrimary whitespace-nowrap my-[12px]">
        Period Status
      </span>
      <Select
        className="w-[144px] text12Medium"
        optionsPadding="right"
        small
        value={periodFilter}
        options={isCandidate ? candidateOptions : options}
        onChange={(option) => {
          setPeriodFilter(option.value);
        }}
      />
    </div>
  );
}

export default function usePeriodSelect({ isCandidate = false } = {}) {
  const router = useRouter();
  const period = getRouterQuery(router, "period") || All;

  return {
    periodFilter: period,
    component: (
      <PeriodFilterSelect
        isCandidate={isCandidate}
        periodFilter={period}
        setPeriodFilter={(period) =>
          period === All
            ? removeRouterQuery(router, "period")
            : addRouterQuery(router, "period", period)
        }
      />
    ),
  };
}

export function usePeriodSelectInDropdown({ isCandidate = false } = {}) {
  const [stagedFilter, setStagedFilter] = useStagedFilterState();
  const [committedFilter] = useCommittedFilterState();

  return {
    periodFilter: committedFilter.period,
    component: (
      <PeriodFilterSelect
        isCandidate={isCandidate}
        periodFilter={stagedFilter.period || All}
        setPeriodFilter={(period) => {
          setStagedFilter({ ...stagedFilter, period });
        }}
      />
    ),
  };
}
