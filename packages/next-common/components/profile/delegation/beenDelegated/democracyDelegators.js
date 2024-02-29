import DataList from "next-common/components/dataList";
import CapitalListItem from "next-common/components/dataList/capitalListItem";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import AddressUser from "next-common/components/user/addressUser";
import ValueDisplay from "next-common/components/valueDisplay";
import { useChainSettings } from "next-common/context/chain";
import { toPrecision } from "next-common/utils";

function DelegatorList({ list, isLoading }) {
  const { decimals, symbol } = useChainSettings();

  const colWidths = {
    delegatingTo: 240,
    capital: 240,
    votes: 160,
  };

  const columns = [
    {
      name: "Address",
      style: {
        textAlign: "left",
        minWidth: colWidths.delegatingTo,
      },
    },
    {
      name: "Capital",
      style: {
        textAlign: "right",
        width: colWidths.capital,
        minWidth: colWidths.capital,
      },
    },
    {
      name: "Votes",
      style: {
        textAlign: "right",
        width: colWidths.votes,
        minWidth: colWidths.votes,
      },
    },
  ];

  const rows = (list || []).map((item) => [
    <AddressUser
      key="user"
      add={item?.target}
      maxWidth={colWidths.delegatingTo}
    />,
    <CapitalListItem
      key="capital"
      item={item}
      capital={toPrecision(item?.balance || 0, decimals)}
    />,
    <ValueDisplay
      key="votes"
      value={toPrecision(item?.votes, decimals)}
      symbol={symbol}
    />,
  ]);

  return (
    <DataList
      loading={isLoading}
      columns={columns}
      rows={rows}
      noDataText="No current delegations"
    />
  );
}

export default function DemocracyDelegators({ delegatorsList, isLoading }) {
  return (
    <>
      <div className="flex mx-[24px] text16Bold gap-[4px]">
        <span className="text-textPrimary">Delegators</span>
        <span className="text-textTertiary">{delegatorsList?.length}</span>
      </div>
      <SecondaryCard>
        <DelegatorList list={delegatorsList} isLoading={isLoading} />
      </SecondaryCard>
    </>
  );
}
