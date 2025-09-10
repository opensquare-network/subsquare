import PostVotesSummary from "next-common/components/postList/common/votesSummary";
import { getGov2ReferendumTitle } from "next-common/utils/gov2/title";
import { Divider } from "../../trackPanel/lineItem";
import { useChainSettings } from "next-common/context/chain";
import Link from "next/link";
import Descriptions from "next-common/components/Descriptions";
import ActionButton from "./actionButton";
import Loading from "next-common/components/loading";
import InfluenceValue from "./influenceValue";
import StateTag from "./stateTag";
import { PostTitleImpl } from "next-common/components/profile/votingHistory/common";
import Gov2TrackTag from "next-common/components/gov2/trackTag";

export default function InfluenceMobileList({
  loading = false,
  referendumData,
  delegateReferendumVotesMap,
}) {
  const { symbol, decimals } = useChainSettings();

  if (!referendumData) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex justify-center">
        <Loading className="mx-auto" size="24px" />
      </div>
    );
  }

  return referendumData.map((referendum) => {
    return (
      <div key={referendum.referendumIndex}>
        <div className="flex items-center gap-2">
          <PostTitleImpl
            key="title"
            referendumIndex={referendum.referendumIndex}
            title={getGov2ReferendumTitle(referendum)}
            url={`/referenda/${referendum.referendumIndex}`}
            className="text14Medium flex-1"
          />
          <ActionButton
            referendum={referendum}
            referendumVotes={
              delegateReferendumVotesMap[referendum.referendumIndex] || []
            }
          />
        </div>
        <Descriptions
          bordered={false}
          className="[&_.descriptions-item-label]:text-textTertiary [&_.descriptions-item]:h-auto [&_.descriptions-item]:my-2"
          items={[
            {
              label: "Track",
              value: (
                <Link
                  key="track"
                  className="inline-flex"
                  href={`/referenda/tracks/${referendum.track}`}
                >
                  <Gov2TrackTag
                    name={referendum.trackInfo.name}
                    id={referendum.track}
                  />
                </Link>
              ),
            },
            {
              label: "Status",
              value: <StateTag referendum={referendum} />,
            },
            {
              label: "Influence",
              value: (
                <InfluenceValue
                  referendum={referendum}
                  referendumVotes={
                    delegateReferendumVotesMap?.[referendum.referendumIndex] ||
                    []
                  }
                />
              ),
            },
            {
              label: "Vote Bar",
              value: (
                <PostVotesSummary
                  tally={referendum.onchainData?.tally}
                  decimals={decimals}
                  symbol={symbol}
                />
              ),
            },
          ]}
        />
        <Divider className="my-3" />
      </div>
    );
  });
}
