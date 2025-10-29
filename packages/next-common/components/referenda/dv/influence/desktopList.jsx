import DataList from "next-common/components/dataList";
import { getGov2ReferendumTitle } from "next-common/utils/gov2/title";
import PostVotesSummary from "next-common/components/postList/common/votesSummary";
import { useChainSettings } from "next-common/context/chain";
import ActionButton from "./actionButton";
import StateTag from "./stateTag";
import InfluenceValue from "./influenceValue";
import { InfluenceLabel } from "./styled";
import { PostTitleImpl } from "next-common/components/profile/votingHistory/common";
import TrackTag from "./trackTag";
import DataListItem from "next-common/components/dataList/item";
import LoadableContent from "next-common/components/common/loadableContent";
import { cn } from "next-common/utils";

const columns = [
  {
    name: "Referendum",
    style: { textAlign: "left" },
    className: "flex-1 whitespace-nowrap overflow-hidden text-ellipsis pr-2",
  },
  {
    name: "Track",
    style: { width: 160, extAlign: "left" },
  },
  {
    name: "",
    style: { width: 24 },
    className: "flex",
  },
  {
    name: "Status",
    style: { width: 120, textAlign: "right" },
  },
  {
    name: <InfluenceLabel className="justify-end" />,
    style: { width: 120, textAlign: "right" },
    className: "flex justify-end",
  },
  {
    name: "",
    style: { width: 80, textAlign: "right" },
    className: "flex justify-end h-6",
  },
];

export default function InfluenceDesktopList({
  list = [],
  delegateReferendumVotesMap,
  loading,
}) {
  return (
    <DataList
      loading={loading}
      title="Influence"
      noDataText="No influence"
      columns={columns}
      rows={list}
      renderItem={(_, idx) => (
        <ListRow
          key={idx}
          row={list[idx]}
          delegateReferendumVotesMap={delegateReferendumVotesMap}
        />
      )}
    />
  );
}

function ListRow({ row, delegateReferendumVotesMap }) {
  const { symbol, decimals } = useChainSettings();
  const referendumDetail = row;

  return (
    <DataListItem
      columns={columns}
      columnClassNames={columns.map((column) => column.className)}
      columnStyles={columns.map((column) => column.style)}
      row={[
        <PostTitleImpl
          key="title"
          referendumIndex={row.referendumIndex}
          className={cn(
            "text14Medium flex items-center [&>a]:truncate [&>a]:max-w-full [&>a]:whitespace-nowrap",
          )}
          title={getGov2ReferendumTitle(referendumDetail)}
          url={`/referenda/${row.referendumIndex}`}
        />,
        <TrackTag key="track" id={row.track} />,
        <LoadableContent key="votesSummary">
          <PostVotesSummary
            tally={referendumDetail?.onchainData?.tally}
            decimals={decimals}
            symbol={symbol}
          />
        </LoadableContent>,
        <StateTag key="state" state={row?.state} />,
        <LoadableContent key="influence">
          <InfluenceValue
            referendum={referendumDetail}
            referendumVotes={
              delegateReferendumVotesMap[row.referendumIndex] || []
            }
          />
        </LoadableContent>,
        <LoadableContent key="action">
          <ActionButton
            referendum={referendumDetail}
            referendumVotes={
              delegateReferendumVotesMap[row.referendumIndex] || []
            }
            key="action"
          />
        </LoadableContent>,
      ]}
    />
  );
}
