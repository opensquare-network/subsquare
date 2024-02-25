import DataList from "next-common/components/dataList";
import Pagination from "next-common/components/pagination";

const columns = [
  {
    name: "Index",
    className: "",
  },
];

export default function FellowshipSalaryCycles({ historyCycles }) {
  const { items = [] } = historyCycles || {};

  const rows = items.map((item) => {
    const { index } = item;
    return [index];
  });

  return (
    <>
      <DataList bordered columns={columns} noDataText="No Cycles" rows={rows} />
      <Pagination {...historyCycles} />
    </>
  );
}
