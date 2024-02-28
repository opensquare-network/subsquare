import { ArrowRight } from "@osn/icons/subsquare";
import noop from "lodash.noop";
import DataList from "next-common/components/dataList";
import Pagination from "next-common/components/pagination";
import Tooltip from "next-common/components/tooltip";
import SecondaryButton from "next-common/lib/button/secondary";
import FellowshipSalaryExpenditure from "./history/expenditure";
import {
  FellowshipSalaryRegisteredPaid,
  FellowshipSalaryUnregisteredPaid,
} from "./history/registerPaid";
import FellowshipSalaryTimeRange from "./history/timeRange";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";

const columns = [
  {
    name: "Index",
    className: "w-20",
  },
  {
    name: "Time Range",
    className: "w-[240px]",
  },
  {
    name: "Expenditure",
  },
  {
    name: "Registered Paid",
    className: "w-40 text-right",
  },
  {
    name: "Unregistered Paid",
    className: "w-40 text-right",
  },
  {
    name: "",
    className: "w-20 text-right",
  },
];

export default function FellowshipSalaryCycles({ historyCycles }) {
  const { items = [] } = historyCycles || {};

  const rows = items.map((item) => {
    const { index } = item;
    return [
      index,
      <FellowshipSalaryTimeRange key="time-range" cycle={item} />,
      <FellowshipSalaryExpenditure key="expenditure" cycle={item} />,
      <div key="registered-paid">
        <FellowshipSalaryRegisteredPaid cycle={item} />
      </div>,
      <div key="unregistered-paid">
        <FellowshipSalaryUnregisteredPaid cycle={item} />
      </div>,
      <div key="action">
        <Tooltip content="View Detail">
          <SecondaryButton
            disabled
            className="w-7 p-0"
            size="small"
            onClick={noop}
          >
            <ArrowRight className="w-4 h-4" />
          </SecondaryButton>
        </Tooltip>
      </div>,
    ];
  });

  return (
    <SecondaryCard>
      <DataList
        className="text14Medium"
        columns={columns}
        noDataText="No Cycles"
        rows={rows}
      />

      <div className="mt-4">
        <Pagination {...historyCycles} />
      </div>
    </SecondaryCard>
  );
}
