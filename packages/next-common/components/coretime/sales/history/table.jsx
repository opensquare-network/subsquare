import { MapDataList } from "next-common/components/dataList";
import ValueDisplay from "next-common/components/valueDisplay";
import { useChainSettings } from "next-common/context/chain";
import { toPrecision } from "next-common/utils";
import { defaultPageSize } from "next-common/utils/constants";
import usePaginationComponent from "next-common/components/pagination/usePaginationComponent";
import { useState } from "react";

export default function SalesHistoryTable() {
  const { decimals, symbol } = useChainSettings();
  const [totalCount, setTotalCount] = useState(0);
  const { page, component: pageComponent } = usePaginationComponent(
    totalCount,
    defaultPageSize,
  );

  // TODO: query data
  const data = {};

  const columns = [
    {
      name: "ID",
      className: "w-[120px]",
      render() {
        return <div></div>;
      },
    },
    {
      name: "Region Begin",
      className: "w-40",
      render() {
        return <div></div>;
      },
    },
    {
      name: "Region End",
      className: "w-40",
      render() {
        return <div></div>;
      },
    },
    {
      name: "Time Range",
      render() {
        return <div></div>;
      },
    },
    {
      name: "",
      className: "w-40",
      render() {
        return <div></div>;
      },
    },
    {
      name: "Total Revenue",
      className: "text-right w-40",
      render() {
        return (
          <div>
            <ValueDisplay
              value={toPrecision(10000000, decimals)}
              symbol={symbol}
            />
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <MapDataList
        loading={false}
        noDataText="No purchases history"
        columnsDef={columns}
        data={data?.items}
      />

      {pageComponent}
    </div>
  );
}
