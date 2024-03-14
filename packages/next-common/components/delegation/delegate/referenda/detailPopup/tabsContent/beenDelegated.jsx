import { SystemMenu } from "@osn/icons/subsquare";
import DataList from "next-common/components/dataList";
import Track from "next-common/components/referenda/track/trackTag";
import ValueDisplay from "next-common/components/valueDisplay";
import { useChainSettings } from "next-common/context/chain";
import SecondaryButton from "next-common/lib/button/secondary";
import { toPrecision } from "next-common/utils";
import { useAllBeenDelegatedList } from "next-common/utils/hooks/referenda/useAllBeenDelegatedList";

export default function ReferendaDelegateeDetailPopupBeenDelegated({
  delegate,
}) {
  const { symbol, decimals } = useChainSettings();
  const { isLoading, beenDelegatedList } = useAllBeenDelegatedList(
    delegate.address,
  );

  const columns = [
    {
      name: "Track",
      width: 190,
    },
    {
      name: "Delegators",
      className: "text-right",
      width: 160,
    },
    {
      name: "Capital",
      className: "text-right",
      width: 160,
    },
    {
      name: "Votes",
      className: "text-right",
      width: 160,
    },
    {
      name: "",
      className: "text-right",
      width: 80,
    },
  ];

  const rows = beenDelegatedList?.map?.((item) => {
    return [
      <Track key={"track"} id={item?.track?.id} />,
      item.beenDelegated?.length,
      <ValueDisplay
        key={"capital"}
        symbol={symbol}
        value={toPrecision(item?.totalBalance, decimals)}
      />,
      <ValueDisplay
        key={"votes"}
        symbol={symbol}
        value={toPrecision(item?.totalVotes, decimals)}
      />,
      // TODO: delegation, been delegated detail
      <SecondaryButton key={"detail"} size="small" className="w-7 p-0">
        <SystemMenu className="w-4 h-4" />
      </SecondaryButton>,
    ];
  });

  return (
    <DataList
      loading={isLoading}
      columns={columns}
      rows={rows}
      noDataText="No been delegated"
    />
  );
}
