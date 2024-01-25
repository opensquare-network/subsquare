import DataList from "next-common/components/dataList";
import ValueDisplay from "next-common/components/valueDisplay";
import { usePageProps } from "next-common/context/page";
import { useSalaryAsset } from "next-common/hooks/useSalaryAsset";
import { toPrecision } from "next-common/utils";
import { useEstimateBlocksTime } from "next-common/utils/hooks";
import { InlineBlockTooltip } from "next-common/components/tooltip";

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

function Period({ blocks = 0 }) {
  const estimatedBlocksTime = useEstimateBlocksTime(blocks);

  return (
    <div>
      <InlineBlockTooltip
        side="top"
        content={`${blocks?.toLocaleString?.()} blocks`}
      >
        <span>{estimatedBlocksTime}</span>
      </InlineBlockTooltip>
    </div>
  );
}

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
