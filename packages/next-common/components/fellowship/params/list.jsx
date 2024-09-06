import DataList from "next-common/components/dataList";
import ValueDisplay from "next-common/components/valueDisplay";
import { getSalaryAsset } from "next-common/utils/consts/getSalaryAsset";
import { toPrecision } from "next-common/utils";
import Period from "next-common/components/fellowship/params/period";
import rankToIndex from "next-common/utils/fellowship/rankToIndex";

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

export default function FellowshipParamsList({ rank, params }) {
  const {
    activeSalary = [],
    passiveSalary = [],
    demotionPeriod = [],
    minPromotionPeriod = [],
  } = params ?? {};

  const { symbol, decimals } = getSalaryAsset();

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
      highlightedIndexes={[rankToIndex(rank)]}
    />
  );
}
