import BigNumber from "bignumber.js";
import DataList from "next-common/components/dataList";
import CapitalListItem from "next-common/components/dataList/capitalListItem";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import AddressUser from "next-common/components/user/addressUser";
import ValueDisplay from "next-common/components/valueDisplay";
import { useChainSettings } from "next-common/context/chain";
import { toPrecision } from "next-common/utils";
import { ConvictionSupport } from "next-common/utils/referendumCommon";

function DelegationList({ delegating, isLoading }) {
  const { decimals, symbol } = useChainSettings();
  const votes = new BigNumber(delegating?.balance || 0)
    .times(ConvictionSupport[delegating?.conviction] || 0)
    .toString();

  const colWidths = {
    delegatingTo: 240,
    capital: 240,
    votes: 160,
  };

  const columns = [
    {
      name: "Target",
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

  let rows = [];
  if (delegating) {
    rows.push([
      <AddressUser
        key="user"
        add={delegating?.target}
        maxWidth={colWidths.delegatingTo}
      />,
      <CapitalListItem
        key="capital"
        item={delegating}
        capital={toPrecision(delegating?.balance || 0, decimals)}
      />,
      <ValueDisplay
        key="votes"
        value={toPrecision(votes, decimals)}
        symbol={symbol}
      />,
    ]);
  }

  return (
    <DataList
      loading={isLoading}
      columns={columns}
      rows={rows}
      noDataText="No current delegations"
    />
  );
}

export default function MyDemocracyDelegation({ delegating, isLoading }) {
  return (
    <>
      <span className="mx-[24px] text16Bold text-textPrimary">List</span>
      <SecondaryCard>
        <DelegationList delegating={delegating} isLoading={isLoading} />
      </SecondaryCard>
    </>
  );
}
