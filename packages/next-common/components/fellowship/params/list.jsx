import DataList from "next-common/components/dataList";
import { usePageProps } from "next-common/context/page";

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

  const rows = activeSalary?.map?.((_, idx) => {
    return [
      idx,
      activeSalary[idx],
      passiveSalary[idx],
      demotionPeriod[idx],
      minPromotionPeriod[idx],
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
