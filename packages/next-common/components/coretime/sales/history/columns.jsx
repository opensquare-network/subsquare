import SecondaryButton from "next-common/lib/button/secondary";
import { ArrowRight } from "@osn/icons/subsquare";
import Tooltip from "next-common/components/tooltip";
import Link from "next/link";
import {
  CoretimeSalesHistoryTimeRange,
  CoretimeSalesHistoryTimeBlock,
} from "./timeRange";
import CoretimeSalesHistoryTotalRevenue from "./totalRevenue";

export const idColumn = {
  name: "ID",
  className: "w-[120px]",
  render(data) {
    return <div>{data?.id}</div>;
  },
};

export const regionBeginColumn = {
  name: "Region Begin",
  className: "w-40",
  render(data) {
    return <div>{data?.info?.regionBegin?.toLocaleString()}</div>;
  },
};

export const regionEndColumn = {
  name: "Region End",
  className: "w-40",
  render(data) {
    return <div>{data?.info?.regionEnd?.toLocaleString()}</div>;
  },
};

export const timeRangeColumn = {
  name: "Time Range",
  render(data) {
    return <CoretimeSalesHistoryTimeRange data={data} />;
  },
};

export const totalRevenueColumn = {
  name: "Total Revenue",
  className: "text-right w-40",
  render(data) {
    return <CoretimeSalesHistoryTotalRevenue data={data} />;
  },
};

export const actionColumn = {
  name: "",
  width: 80,
  className: "text-right",
  render(data) {
    const link = `/coretime/sales/${data?.id}`;

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

export const mobileStartTimeColumns = {
  name: "Start Time",
  render(data) {
    return (
      <CoretimeSalesHistoryTimeBlock
        key="start-time"
        indexer={data.initIndexer}
      />
    );
  },
};

export const mobileEndTimeColumns = {
  name: "End Time",
  render(data) {
    return (
      <CoretimeSalesHistoryTimeBlock
        key="start-time"
        indexer={data.endIndexer}
      />
    );
  },
};
