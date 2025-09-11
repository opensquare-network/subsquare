import BigNumber from "bignumber.js";
import CapitalListItem from "next-common/components/dataList/capitalListItem";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import AddressUser from "next-common/components/user/addressUser";
import ValueDisplay from "next-common/components/valueDisplay";
import { useChainSettings } from "next-common/context/chain";
import { toPrecision } from "next-common/utils";
import { ConvictionSupport } from "next-common/utils/referendumCommon";
import DelegationList from "../common/delegationList";

export function useColumnsDef() {
  const { decimals, symbol } = useChainSettings();

  const colWidths = {
    delegatingTo: 240,
    capital: 240,
    votes: 160,
  };

  return [
    {
      name: "Target",
      style: {
        textAlign: "left",
        minWidth: colWidths.delegatingTo,
      },
      render: (item) => (
        <AddressUser
          key="user"
          add={item?.target}
          maxWidth={colWidths.delegatingTo}
        />
      ),
    },
    {
      name: "Capital",
      style: {
        textAlign: "right",
        width: colWidths.capital,
        minWidth: colWidths.capital,
      },
      render: (item) => (
        <CapitalListItem
          key="capital"
          item={item}
          capital={toPrecision(item?.balance || 0, decimals)}
        />
      ),
    },
    {
      name: "Votes",
      style: {
        textAlign: "right",
        width: colWidths.votes,
        minWidth: colWidths.votes,
      },
      render: (item) => (
        <ValueDisplay
          key="votes"
          value={toPrecision(
            new BigNumber(item?.balance || 0)
              .times(ConvictionSupport[item?.conviction] || 0)
              .toString(),
            decimals,
          )}
          symbol={symbol}
        />
      ),
    },
  ];
}

export function Title() {
  return <span className="mx-[24px] text16Bold text-textPrimary">List</span>;
}

export default function MyDemocracyDelegation({ delegating, isLoading }) {
  const columnsDef = useColumnsDef();
  return (
    <>
      <Title />
      <SecondaryCard>
        <DelegationList
          isLoading={isLoading}
          delegations={delegating && [delegating]}
          columnsDef={columnsDef}
        />
      </SecondaryCard>
    </>
  );
}
