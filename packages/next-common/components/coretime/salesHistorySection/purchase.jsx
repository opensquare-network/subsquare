import dayjs from "dayjs";
import { MapDataList } from "next-common/components/dataList";
import Duration from "next-common/components/duration";
import Pagination from "next-common/components/pagination";
import AddressUser from "next-common/components/user/addressUser";
import ValueDisplay from "next-common/components/valueDisplay";
import { useChainSettings } from "next-common/context/chain";
import { usePageProps } from "next-common/context/page";
import { useCoretimeQuery } from "next-common/hooks/apollo";
import { GET_CORETIME_SALE_PURCHASES } from "next-common/services/gql/coretime";
import { toPrecision } from "next-common/utils";
import { defaultPageSize } from "next-common/utils/constants";
import { useState } from "react";

export default function SalesHistoryPurchase() {
  const { decimals, symbol } = useChainSettings();
  const { id } = usePageProps();
  const [page, setPage] = useState(1);
  const [isTime, setIsTime] = useState(true);

  const pageSize = defaultPageSize;

  const { data, loading } = useCoretimeQuery(GET_CORETIME_SALE_PURCHASES, {
    variables: {
      saleId: id,
      offset: (page - 1) * pageSize,
      limit: pageSize,
    },
  });

  const columns = [
    {
      name: "Extrinsic ID",
      className: "w-40",
      render(data) {
        return (
          <div>
            {data?.indexer?.blockHeight}-{data?.indexer?.extrinsicIndex}
          </div>
        );
      },
    },
    {
      name: "Core",
      className: "w-[120px]",
      render(data) {
        return <div>#{data?.regionId?.core}</div>;
      },
    },
    {
      name: "Purchased By",
      className: "w-60",
      render(data) {
        return (
          <div>
            <AddressUser add={data?.who} />
          </div>
        );
      },
    },
    // TODO: coretime, to the browser
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
      className: "w-40",
      render(data) {
        const time = data?.indexer?.blockTime;

        return (
          <div className="text-textTertiary">
            {isTime ? (
              dayjs(time).format("YYYY-MM-DD HH:mm:ss")
            ) : (
              <Duration time={time} />
            )}
          </div>
        );
      },
    },
    {
      name: "Price",
      className: "text-right",
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
        noDataText="No purchase history"
        columnsDef={columns}
        data={data?.coretimeSalePurchases?.items}
      />

      <div className="mt-4">
        <Pagination
          page={page}
          total={data?.coretimeSalePurchases?.total}
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
