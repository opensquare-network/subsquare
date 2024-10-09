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
export const Promotable = "promotable";

const options = [
  {
    label: "All",
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

function PeriodFilterSelect({ periodFilter, setPeriodFilter }) {
  return (
    <div className="flex items-center gap-[8px]">
      <span className="text12Medium text-textPrimary whitespace-nowrap">
        Period Status
      </span>
      <Select
        className="w-[160px] text12Medium"
        optionsPadding="right"
        small
        value={periodFilter}
        options={options}
        onChange={(option) => {
          setPeriodFilter(option.value);
        }}
      />
    </div>
  );
}

export default function usePeriodSelect() {
  const router = useRouter();
  const period = getRouterQuery(router, "period") || All;

  return {
    periodFilter: period,
    component: (
      <PeriodFilterSelect
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
