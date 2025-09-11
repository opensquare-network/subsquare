import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import { toPrecision } from "next-common/utils";
import { useChainSettings } from "next-common/context/chain";
import CapitalListItem from "next-common/components/dataList/capitalListItem";
import AddressUser from "next-common/components/user/addressUser";
import { useSelector } from "react-redux";
import Track from "next-common/components/referenda/track/trackTag";
import ValueDisplay from "next-common/components/valueDisplay";
import { profileReferendaDelegationsSelector } from "next-common/store/reducers/profile/referendaDelegations";
import DelegationList from "../common/delegationList";

export function useColumnsDef() {
  const { decimals, symbol } = useChainSettings();

  const colWidths = {
    track: 160,
    delegatingTo: 240,
    capital: 240,
    votes: 160,
  };

  return [
    {
      name: "Track",
      style: {
        textAlign: "left",
        whiteSpace: "nowrap",
        minWidth: 160,
      },
      render: (item) => <Track key="track" id={item.trackId} />,
    },
    {
      name: "Target",
      style: {
        textAlign: "left",
        minWidth: 240,
      },
      render: (item) => (
        <AddressUser
          key="user"
          add={item.target}
          maxWidth={colWidths.delegatingTo}
        />
      ),
    },
    {
      name: "Capital",
      style: {
        textAlign: "right",
        width: 240,
        minWidth: 240,
      },
      render: (item) => (
        <CapitalListItem
          key="capital"
          item={item}
          capital={toPrecision(item.balance, decimals)}
          conviction={item.conviction}
        />
      ),
    },
    {
      name: "Votes",
      style: {
        textAlign: "right",
        width: 160,
        minWidth: 160,
      },
      render: (item) => (
        <ValueDisplay
          key="votes"
          value={toPrecision(item.votes, decimals)}
          symbol={symbol}
        />
      ),
    },
  ];
}

export function Title({ delegations }) {
  return (
    <div className="flex mx-[24px] text16Bold gap-[4px]">
      <span className="text-textPrimary">Tracks</span>
      <span className="text-textTertiary">{delegations?.length || 0}</span>
    </div>
  );
}

export default function OpenGovDelegationList() {
  const delegations = useSelector(profileReferendaDelegationsSelector);
  const columnsDef = useColumnsDef();
  return (
    <>
      <Title delegations={delegations} />
      <SecondaryCard>
        <DelegationList
          isLoading={!delegations}
          delegations={delegations}
          columnsDef={columnsDef}
        />
      </SecondaryCard>
    </>
  );
}
