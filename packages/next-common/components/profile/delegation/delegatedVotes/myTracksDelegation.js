import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import { toPrecision } from "next-common/utils";
import { useChainSettings } from "next-common/context/chain";
import CapitalListItem from "next-common/components/dataList/capitalListItem";
import AddressUser from "next-common/components/user/addressUser";
import { useSelector } from "react-redux";
import { myReferendaDelegationsSelector } from "next-common/store/reducers/myOnChainData/referenda/myReferendaDelegations";
import Track from "next-common/components/referenda/track/trackTag";
import DataList from "next-common/components/dataList";
import ValueDisplay from "next-common/components/valueDisplay";

function DelegationList() {
  const { decimals, symbol } = useChainSettings();
  const delegations = useSelector(myReferendaDelegationsSelector);

  const colWidths = {
    track: 160,
    delegatingTo: 240,
    capital: 240,
    votes: 160,
  };

  const columns = [
    {
      name: "Track",
      style: {
        textAlign: "left",
        whiteSpace: "nowrap",
        minWidth: colWidths.track,
      },
    },
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

  const rows = delegations.map((item) => {
    const row = [
      <Track key="track" id={item.trackId} />,
      <AddressUser
        key="user"
        add={item.target}
        maxWidth={colWidths.delegatingTo}
      />,
      <CapitalListItem
        key="capital"
        item={item}
        capital={toPrecision(item.balance, decimals)}
        conviction={item.conviction}
      />,
      <ValueDisplay
        key="votes"
        value={toPrecision(item.votes, decimals)}
        symbol={symbol}
      />,
    ];

    row.key = item.trackId;
    return row;
  });

  return (
    <DataList
      columns={columns}
      rows={rows}
      noDataText="No current delegations"
    />
  );
}

export default function MyTracksDelegation() {
  const delegations = useSelector(myReferendaDelegationsSelector);

  return (
    <>
      <div className="flex mx-[24px] text16Bold gap-[4px]">
        <span className="text-textPrimary">Tracks</span>
        <span className="text-textTertiary">{delegations?.length || 0}</span>
      </div>
      <SecondaryCard>
        <DelegationList />
      </SecondaryCard>
    </>
  );
}
