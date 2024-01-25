import DataList from "next-common/components/dataList";
import ValueDisplay from "next-common/components/valueDisplay";
import { usePageProps } from "next-common/context/page";
import { useSalaryAsset } from "next-common/hooks/useSalaryAsset";
import { toPrecision } from "next-common/utils";
import Period from "next-common/components/fellowship/params/period";

const columns = [
  {
    name: "Index",
    className: "",
  },
  {
    name: "Active Salary",
    className: "w-[200px] text-right",
  },
  {
    name: "Passive Salary",
    className: "w-[200px] text-right",
  },
  {
    name: "Demotion Period",
    className: "w-[200px] text-right",
  },
  {
    name: "Min Promotion Period",
    className: "w-[200px] text-right",
  },
];

export default function FellowshipParamsList({ rank }) {
  const { fellowshipParams } = usePageProps();
  const {
    activeSalary = [],
    passiveSalary = [],
    demotionPeriod = [],
    minPromotionPeriod = [],
  } = fellowshipParams ?? {};

  const { symbol, decimals } = useSalaryAsset();

  const rows = activeSalary?.map?.((_, idx) => {
    return [
      idx,
      <ValueDisplay
        key={`active-salary-${idx}`}
        value={toPrecision(activeSalary[idx], decimals)}
        symbol={symbol}
      />,
      <ValueDisplay
        key={`passive-salary-${idx}`}
        value={toPrecision(passiveSalary[idx], decimals)}
        symbol={symbol}
      />,
      <Period key={`demotion-period-${idx}`} blocks={demotionPeriod[idx]} />,
      <Period
        key={`min-promotion-period-${idx}`}
        blocks={minPromotionPeriod[idx]}
      />,
    ];
  });

  return (
    <DataList
      bordered
      columns={columns}
      noDataText="No Params"
      rows={rows}
      highlightedIndexes={[rank]}
    />
  );
}
