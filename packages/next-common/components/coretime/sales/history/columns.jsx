import SecondaryButton from "next-common/lib/button/secondary";
import { ArrowRight } from "@osn/icons/subsquare";
import Tooltip from "next-common/components/tooltip";
import Link from "next/link";
import { CoretimeSalesHistoryTimeRange } from "./timeRange";
import CoretimeSalesHistoryTotalRevenue from "./totalRevenue";

export const IDColumn = {
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
    return <div>{data?.info?.regionBegin.toLocaleString()}</div>;
  },
};

export const regionEndColumn = {
  name: "Region End",
  className: "w-40",
  render(data) {
    return <div>{data?.info?.regionEnd.toLocaleString()}</div>;
  },
};

export const timeRangeColumn = {
  name: "Time Range",
  // width: 240,
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

// TODO: view details
export const actionColumn = {
  name: "",
  width: 80,
  className: "text-right",
  render() {
    // (data, { resolveActionColLink })
    // const link = resolveActionColLink?.(data);

    return (
      <Tooltip content="View Detail">
        <Link href={""}>
          <SecondaryButton size="small" className="w-7 p-0">
            <ArrowRight className="w-4 h-4" />
          </SecondaryButton>
        </Link>
      </Tooltip>
    );
  },
};
