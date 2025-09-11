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
import TrackTag from "./trackTag";

export default function InfluenceMobileList({
  list = [],
  delegateReferendumVotesMap,
}) {
  // if (loading) {
  //   return (
  //     <div className="flex justify-center">
  //       <Loading className="mx-auto" size="24px" />
  //     </div>
  //   );
  // }

  if (list.length <= 0) {
    return <NoData text="No influence" />;
  }

  return list.map((referendum) => {
    return (
      <ListRow
        key={referendum.referendumIndex}
        referendum={referendum}
        delegateReferendumVotesMap={delegateReferendumVotesMap}
      />
    );
  });
}

function ListRow({ referendum, delegateReferendumVotesMap }) {
  const { symbol, decimals } = useChainSettings();
  const { value: referendumDetail, loading } = useAsync(async () => {
    const res = await fetchReferendumData(referendum.referendumIndex);
    return res;
  }, [referendum.referendumIndex]);

  return (
    <div key={referendum.referendumIndex}>
      <div className="flex items-center gap-2">
        <PostTitleImpl
          key="title"
          referendumIndex={referendum.referendumIndex}
          title={
            loading ? (
              <LoadableContent key="influence" isLoading={loading} />
            ) : (
              getGov2ReferendumTitle(referendumDetail)
            )
          }
          url={`/referenda/${referendum.referendumIndex}`}
          className="text14Medium flex-1"
        />
        <LoadableContent key="action" isLoading={loading}>
          <ActionButton
            referendum={referendumDetail}
            referendumVotes={
              delegateReferendumVotesMap[referendum.referendumIndex] || []
            }
          />
        </LoadableContent>
      </div>
      <Descriptions
        bordered={false}
        className="[&_.descriptions-item-label]:text-textTertiary [&_.descriptions-item]:h-auto [&_.descriptions-item]:my-2"
        items={[
          {
            label: "Track",
            value: <TrackTag key="track" id={referendum.track} />,
          },
          {
            label: "Status",
            value: <StateTag state={referendum.state} />,
          },
          {
            label: "Influence",
            value: (
              <LoadableContent key="influence" isLoading={loading}>
                <InfluenceValue
                  referendum={referendumDetail}
                  referendumVotes={
                    delegateReferendumVotesMap?.[referendum.referendumIndex] ||
                    []
                  }
                />
              </LoadableContent>
            ),
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
        ]}
      />
      <Divider className="my-3" />
    </div>
  );
}
