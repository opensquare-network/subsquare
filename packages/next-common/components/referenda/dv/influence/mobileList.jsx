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
import LoadableContent from "next-common/components/common/loadableContent";
import TrackTag from "./trackTag";
import { cn } from "next-common/utils";
import Loading from "next-common/components/loading";

export default function InfluenceMobileList({
  list = [],
  delegateReferendumVotesMap,
  loading,
}) {
  if (list.length <= 0) {
    return <NoData text="No influence" />;
  }

  if (loading) {
    return (
      <div className="flex justify-center py-4">
        <Loading size={20} />
      </div>
    );
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

  return (
    <div key={row.referendumIndex}>
      <div className="flex items-center gap-2 h-6">
        <PostTitleImpl
          key="title"
          referendumIndex={row.referendumIndex}
          title={getGov2ReferendumTitle(row)}
          url={`/referenda/${row.referendumIndex}`}
          className={cn(
            "text14Medium flex flex-1 items-center [&>a]:truncate [&>a]:flex-1",
          )}
        />
        <LoadableContent key="action">
          <ActionButton
            referendum={row}
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
              <LoadableContent key="votesSummary">
                <PostVotesSummary
                  tally={row?.onchainData?.tally}
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
              <LoadableContent key="influence">
                <InfluenceValue
                  referendum={row}
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
