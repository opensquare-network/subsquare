import DataList from "next-common/components/dataList";
import Pagination from "next-common/components/pagination";
import FellowshipSalaryExpenditure from "./history/expenditure";
import {
  FellowshipSalaryRegisteredPaid,
  FellowshipSalaryUnregisteredPaid,
} from "./history/registerPaid";
import {
  FellowshipSalaryTimeRange,
  FellowshipSalaryTimeBlock,
} from "./history/timeRange";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import SecondaryButton from "next-common/lib/button/secondary";
import { ArrowRight } from "@osn/icons/subsquare";
import Tooltip from "next-common/components/tooltip";
import Link from "next/link";
import { noop } from "lodash-es";

const indexColumn = {
  name: "Index",
  width: 80,
  cellRender(data) {
    return data.index;
  },
};

const timeRangeColumn = {
  name: "Time Range",
  width: 240,
  cellRender(data) {
    return <FellowshipSalaryTimeRange cycle={data} />;
  },
};

const expenditureColumn = {
  name: "Expenditure",
  className: "min-w-[140px]",
  cellRender(data) {
    return <FellowshipSalaryExpenditure cycle={data} />;
  },
};

const registeredPaidColumn = {
  name: "Registered Paid",
  width: 160,
  className: "text-right",
  cellRender(data) {
    return <FellowshipSalaryRegisteredPaid cycle={data} />;
  },
};

const unregisteredPaidColumn = {
  name: "Unregistered Paid",
  width: 160,
  className: "text-right",
  cellRender(data) {
    return <FellowshipSalaryUnregisteredPaid cycle={data} />;
  },
};

const actionColumn = {
  name: "",
  width: 80,
  className: "text-right",
  cellRender(data, { resolveActionColLink }) {
    const link = resolveActionColLink?.(data);

    return (
      <Tooltip content="View Detail">
        <Link href={link}>
          <SecondaryButton size="small" className="w-7 p-0">
            <ArrowRight className="w-4 h-4" />
          </SecondaryButton>
        </Link>
      </Tooltip>
    );
  },
};

const desktopColumns = [
  indexColumn,
  timeRangeColumn,
  expenditureColumn,
  registeredPaidColumn,
  unregisteredPaidColumn,
  actionColumn,
];

const mobileColumns = [
  indexColumn,
  {
    name: "Start Time",
    cellRender(data) {
      return (
        <FellowshipSalaryTimeBlock key="start-time" indexer={data.indexer} />
      );
    },
  },
  {
    name: "End Time",
    cellRender(data) {
      return (
        <FellowshipSalaryTimeBlock key="end-time" indexer={data.endIndexer} />
      );
    },
  },
  expenditureColumn,
  registeredPaidColumn,
  unregisteredPaidColumn,
  actionColumn,
];

export default function FellowshipSalaryCycles({
  historyCycles,
  resolveActionColLink = noop,
}) {
  const { items = [] } = historyCycles || {};

  const desktopRows = items.map((item) => {
    return desktopColumns.map((col) =>
      col.cellRender?.(item, { resolveActionColLink }),
    );
  });

  const mobileRows = items.map((item) => {
    return mobileColumns.map((col) =>
      col.cellRender?.(item, { resolveActionColLink }),
    );
  });

  return (
    <SecondaryCard>
      <DataList
        className="text14Medium max-sm:hidden"
        columns={desktopColumns}
        noDataText="No Cycles"
        rows={desktopRows}
      />

      <DataList
        className="text14Medium hidden max-sm:block"
        columns={mobileColumns}
        noDataText="No Cycles"
        rows={mobileRows}
      />

      <div className="mt-4">
        <Pagination {...historyCycles} />
      </div>
    </SecondaryCard>
  );
}
