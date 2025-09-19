import PostVotesSummary from "next-common/components/postList/common/votesSummary";
import { getGov2ReferendumTitle } from "next-common/utils/gov2/title";
import { Divider } from "../../trackPanel/lineItem";
import { useChainSettings } from "next-common/context/chain";
import Descriptions from "next-common/components/Descriptions";
import ActionButton from "./actionButton";
import InfluenceValue from "./influenceValue";
import StateTag from "./stateTag";
import { PostTitleImpl } from "next-common/components/profile/votingHistory/common";
import NoData from "next-common/components/noData";
import { fetchReferendumData } from "next-common/services/referendaData";
import { useAsync } from "react-use";
import LoadableContent from "next-common/components/common/loadableContent";
import FieldLoading from "next-common/components/icons/fieldLoading";
import TrackTag from "./trackTag";
import { cn } from "next-common/utils";

export default function InfluenceMobileList({
  list = [],
  delegateReferendumVotesMap,
}) {
  if (list.length <= 0) {
    return <NoData text="No influence" />;
  }

  return list.map((row) => {
    return (
      <ListRow
        key={row.referendumIndex}
        row={row}
        delegateReferendumVotesMap={delegateReferendumVotesMap}
      />
    );
  });
}

function ListRow({ row, delegateReferendumVotesMap }) {
  const { symbol, decimals } = useChainSettings();
  const { value: referendumDetail, loading } = useAsync(
    async () => await fetchReferendumData(row.referendumIndex),
    [row.referendumIndex],
  );

  return (
    <div key={row.referendumIndex}>
      <div className="flex items-center gap-2 h-6">
        <PostTitleImpl
          key="title"
          referendumIndex={row.referendumIndex}
          title={
            loading ? (
              <FieldLoading className="flex" />
            ) : (
              getGov2ReferendumTitle(referendumDetail)
            )
          }
          url={`/referenda/${row.referendumIndex}`}
          className={cn(
            "text14Medium flex flex-1 items-center [&>a]:truncate [&>a]:flex-1",
            loading && "[&>a>span]:flex",
          )}
        />
        <LoadableContent key="action" isLoading={loading}>
          <ActionButton
            referendum={referendumDetail}
            referendumVotes={
              delegateReferendumVotesMap[row.referendumIndex] || []
            }
          />
        </LoadableContent>
      </div>
      <Descriptions
        bordered={false}
        className="[&_.descriptions-item-label]:text-textTertiary [&_.descriptions-item]:h-6 [&_.descriptions-item]:my-2"
        items={[
          {
            label: "Track",
            value: <TrackTag key="track" id={row.track} />,
          },
          {
            label: "Vote Bar",
            value: (
              <LoadableContent key="votesSummary" isLoading={loading}>
                <PostVotesSummary
                  tally={referendumDetail?.onchainData?.tally}
                  decimals={decimals}
                  symbol={symbol}
                />
              </LoadableContent>
            ),
          },
          {
            label: "Status",
            value: <StateTag state={row.state} />,
          },
          {
            label: "Influence",
            value: (
              <LoadableContent key="influence" isLoading={loading}>
                <InfluenceValue
                  referendum={referendumDetail}
                  referendumVotes={
                    delegateReferendumVotesMap?.[row.referendumIndex] || []
                  }
                />
              </LoadableContent>
            ),
          },
        ]}
      />
      <Divider className="my-3" />
    </div>
  );
}
