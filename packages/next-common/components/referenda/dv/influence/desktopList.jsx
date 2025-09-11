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
import { fetchReferendumData } from "next-common/services/referendaData";
import { useAsync } from "react-use";
import DataListItem from "next-common/components/dataList/item";
import LoadableContent from "next-common/components/common/loadableContent";
import FieldLoading from "next-common/components/icons/fieldLoading";
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
}) {
  return (
    <DataList
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
  const { value: referendumDetail, loading } = useAsync(async () => {
    const res = await fetchReferendumData(row.referendumIndex);
    return res;
  }, [row.referendumIndex]);

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
            loading && "[&>a>span]:flex",
          )}
          title={
            loading ? (
              <FieldLoading className="flex h-5" />
            ) : (
              getGov2ReferendumTitle(referendumDetail)
            )
          }
          url={`/referenda/${row.referendumIndex}`}
        />,
        <TrackTag key="track" id={row.track} />,
        <LoadableContent key="votesSummary" isLoading={loading}>
          <PostVotesSummary
            tally={referendumDetail?.onchainData?.tally}
            decimals={decimals}
            symbol={symbol}
          />
        </LoadableContent>,
        <StateTag key="state" state={row?.state} />,
        <LoadableContent key="influence" isLoading={loading}>
          <InfluenceValue
            referendum={referendumDetail}
            referendumVotes={
              delegateReferendumVotesMap[row.referendumIndex] || []
            }
          />
        </LoadableContent>,
        <LoadableContent key="action" isLoading={loading}>
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
