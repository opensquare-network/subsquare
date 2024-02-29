import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import { useChainSettings } from "next-common/context/chain";
import Track from "next-common/components/referenda/track/trackTag";
import ValueDisplay from "next-common/components/valueDisplay";
import DataList from "next-common/components/dataList";
import { toPrecision } from "next-common/utils";

function BeenDelegatedList({ list }) {
  const { decimals, symbol } = useChainSettings();

  const colWidths = {
    track: 160,
    delegators: 240,
    votes: 160,
  };

  const columns = [
    {
      name: "Track",
      style: {
        textAlign: "left",
        minWidth: colWidths.tracks,
      },
    },
    {
      name: "Delegators",
      style: {
        textAlign: "right",
        width: colWidths.delegators,
        minWidth: colWidths.delegators,
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
    <Track key="track" id={item.track.id} />,
    <span key="delegators">{item.beenDelegated?.length}</span>,
    <ValueDisplay
      key="votes"
      value={toPrecision(item?.totalVotes, decimals)}
      symbol={symbol}
    />,
  ]);

  return (
    <DataList
      columns={columns}
      rows={rows}
      noDataText="No current delegations"
    />
  );
}

export default function ReferendaBeenDelegated({ beenDelegatedList }) {
  return (
    <>
      <div className="flex mx-[24px] text16Bold gap-[4px]">
        <span className="text-textPrimary">Tracks</span>
        <span className="text-textTertiary">{beenDelegatedList?.length}</span>
      </div>
      <SecondaryCard>
        <BeenDelegatedList list={beenDelegatedList} />
      </SecondaryCard>
    </>
  );
}
