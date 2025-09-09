import {
  useFilteredDvReferenda,
  useDvReferendaCount,
} from "next-common/context/referenda/dv";
import PostVotesSummary from "next-common/components/postList/common/votesSummary";
import { getGov2ReferendumTitle } from "next-common/utils/gov2/title";
import { Divider } from "../../trackPanel/lineItem";
import { useChainSettings } from "next-common/context/chain";
import Link from "next/link";
import Descriptions from "next-common/components/Descriptions";
import Track from "../../track/trackTag";
import { Influence, StateTag } from "./desktopList";
import ActionButton from "./actionButton";

export default function InfluenceMobileList({
  referendumData,
  delegateReferendumVotesMap,
}) {
  const { symbol, decimals } = useChainSettings();

  if (!referendumData) {
    return null;
  }

  return referendumData.map((referendum) => {
    return (
      <div key={referendum.referendumIndex}>
        <div className="flex items-center gap-2">
          <Link
            href={`/referenda/${referendum.referendumIndex}`}
            key="title"
            className="flex-1 max-w-full overflow-hidden text-ellipsis whitespace-nowrap"
          >
            {getGov2ReferendumTitle(referendum)}
          </Link>
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
              value: <Track id={referendum.track} />,
            },
            {
              label: "Status",
              value: <StateTag referendum={referendum} />,
            },
            {
              label: "Influence",
              value: (
                <Influence
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
