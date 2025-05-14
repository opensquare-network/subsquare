import DataList from "next-common/components/dataList";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import { TableName } from "next-common/components/data/common/tableHeader";
import AddressUser from "next-common/components/user/addressUser";
import { useChainSettings } from "next-common/context/chain";
import { toPrecision } from "next-common/utils";
import { formatTimeAgo } from "next-common/utils/viewfuncs/formatTimeAgo";

const columns = [
  {
    name: "Registrar",
  },
  {
    name: "Latest Judgement",
    width: 160,
  },
  {
    name: "Received Request",
    width: 160,
    headClassName: "text-right",
  },
  {
    name: "Total Given",
    width: 160,
    headClassName: "text-right",
  },
  {
    name: "Fee",
    width: 160,
    headClassName: "text-right",
  },
];

export default function RegistrarsTable({
  registrars = [],
  isLoading,
  total = 0,
}) {
  const { decimals, symbol } = useChainSettings();

  return (
    <div className="flex flex-col gap-y-4">
      <TableName title="Registrars" total={total} loading={isLoading} />
      <SecondaryCard className="space-y-2">
        <DataList
          columns={columns}
          rows={(registrars || []).map((item, index) => {
            const time = item?.statistics?.lastGivenIndexer?.blockTime;
            return [
              <RegistrarUserAddress
                key={`account-${item.account}`}
                item={item}
                index={index}
              />,
              <div
                key={`last-judgement-${item.account}`}
                className="text-textTertiary text14Medium"
              >
                {time ? formatTimeAgo(time) : "-"}
              </div>,
              <div
                key={`request-${index}`}
                className="text-textPrimary text14Medium text-right"
              >
                {item?.statistics?.request || "-"}
              </div>,
              <div
                key={`given-${index}`}
                className="text-textPrimary text14Medium text-right"
              >
                {item?.statistics?.given || "-"}
              </div>,
              <div
                key={`fee-${index}`}
                className="text-textPrimary text14Medium text-right"
              >
                {toPrecision(item.fee, decimals)} {symbol}
              </div>,
            ];
          })}
          loading={isLoading}
          noDataText="No registrars"
        />
      </SecondaryCard>
    </div>
  );
}

function RegistrarUserAddress({ item, index }) {
  return (
    <div className="flex items-center gap-x-2">
      <span className="text-textPrimary text14Medium inline-block w-6">
        #{index + 1}
      </span>
      <AddressUser key={`account-${item.account}`} add={item.account} />
    </div>
  );
}
