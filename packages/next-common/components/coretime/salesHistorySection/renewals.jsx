import dayjs from "dayjs";
import { MapDataList } from "next-common/components/dataList";
import Duration from "next-common/components/duration";
import ExplorerLink from "next-common/components/links/explorerLink";
import Pagination from "next-common/components/pagination";
import AddressUser from "next-common/components/user/addressUser";
import ValueDisplay from "next-common/components/valueDisplay";
import { useChainSettings } from "next-common/context/chain";
import { usePageProps } from "next-common/context/page";
import { useCoretimeQuery } from "next-common/hooks/apollo";
import { GET_CORETIME_SALE_RENEWALS } from "next-common/services/gql/coretime";
import { toPrecision } from "next-common/utils";
import { defaultPageSize } from "next-common/utils/constants";
import { useState } from "react";

export default function SalesHistoryRenewals() {
  const { decimals, symbol } = useChainSettings();
  const { id } = usePageProps();
  const [page, setPage] = useState(1);
  const [isTime, setIsTime] = useState(true);

  const pageSize = defaultPageSize;

  const { data, loading } = useCoretimeQuery(GET_CORETIME_SALE_RENEWALS, {
    variables: {
      saleId: id,
      offset: (page - 1) * pageSize,
      limit: pageSize,
    },
  });

  const columns = [
    {
      name: "Core",
      className: "w-[120px]",
      render(data) {
        return <div>#{data?.core}</div>;
      },
    },
    {
      name: "Old Core",
      className: "w-[120px]",
      render(data) {
        return <div>#{data?.oldCore}</div>;
      },
    },
    {
      name: "Renewed By",
      className: "w-80",
      render(data) {
        return (
          <div>
            <AddressUser add={data?.who} />
          </div>
        );
      },
    },
    {
      name: (
        <button
          className="text-theme500"
          onClick={() => {
            setIsTime(!isTime);
          }}
        >
          {isTime ? "Time" : "Age"}
        </button>
      ),
      className: "min-w-[160px]",
      render(data) {
        const time = data?.indexer?.blockTime;

        return (
          <ExplorerLink indexer={data?.indexer}>
            <div className="text-textTertiary hover:underline">
              {isTime ? (
                dayjs(time).format("YYYY-MM-DD HH:mm:ss")
              ) : (
                <Duration time={time} />
              )}
            </div>
          </ExplorerLink>
        );
      },
    },
    {
      name: "Price",
      className: "w-40 text-right",
      render(data) {
        return (
          <div>
            <ValueDisplay
              value={toPrecision(data?.price, decimals)}
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
        loading={loading}
        noDataText="No renewals history"
        columnsDef={columns}
        data={data?.coretimeSaleRenewals?.items}
      />

      <div className="mt-4">
        <Pagination
          page={page}
          total={data?.coretimeSaleRenewals?.total}
          pageSize={pageSize}
          onPageChange={(e, newPage) => {
            e.preventDefault();
            setPage(newPage);
          }}
        />
      </div>
    </div>
  );
}
