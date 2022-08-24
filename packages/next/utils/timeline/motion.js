import dayjs from "dayjs";
import User from "next-common/components/user";
import Voting from "next-common/components/timelineMotionVoting";
import businessCategory from "next-common/utils/consts/business/category";
import { Approve, Reject } from "next-common/components/icons";
import styled from "styled-components";
import Flex from "next-common/components/styled/flex";

const VoteResultWrapper = styled(Flex)`
  justify-content: space-between;
  > :last-child {
    display: flex;
    align-items: center;
    > span {
      margin-left: 4px;
    }
  }
`;

export function createArgs(method, args, chain) {
  switch (method) {
    case "proposeCurator": {
      const [bountyId, curator] = args;
      return [
        {
          name: "bountyIndex",
          value: bountyId.value,
        },
        {
          name: curator.name,
          value: <User chain={chain} add={curator.value.id} fontSize={14} />,
        },
      ];
    }
    default:
      return [];
  }
}

export function createMotionTimelineData(
  motion = {},
  chain,
  linkable = false,
  linkPrefix = ""
) {
  const {
    indexer,
    hash,
    proposer,
    proposal,
    voting,
    tally,
    threshold,
    timeline = [],
  } = motion;

  const type = businessCategory.collective;

  return timeline.map((item) => {
    switch (item.method) {
      case "Proposed": {
        const urlSuffix = `${indexer.blockHeight}_${hash}`;
        let link;
        if (linkable) {
          link = [linkPrefix, urlSuffix].join("/");
        }

        return {
          indexer: item.indexer,
          hash: motion.hash,
          time: dayjs(item.indexer.blockTime).format("YYYY-MM-DD HH:mm:ss"),
          status: {
            value: linkable ? `Motion #${motion.index}` : "Proposed",
            link,
            type,
          },
          data: (
            <Voting
              data={{
                proposer: proposer,
                method: proposal.method,
                args: createArgs(proposal.method, proposal.args, chain),
                total: threshold || voting?.threshold,
                ayes: tally?.yesVotes || (voting?.ayes || []).length,
                nays: tally?.noVotes || (voting?.nays || []).length,
              }}
              chain={chain}
            />
          ),
          method: item.method,
        };
      }
      case "Voted": {
        return {
          indexer: item.indexer,
          hash: motion.hash,
          time: dayjs(item.indexer.blockTime).format("YYYY-MM-DD HH:mm:ss"),
          status: { value: "Vote", type },
          data: (
            <VoteResultWrapper>
              <User chain={chain} add={item.args.voter} />
              {item.args.approve ? (
                <div>
                  Aye
                  <Approve />
                </div>
              ) : (
                <div>
                  Nay
                  <Reject />
                </div>
              )}
            </VoteResultWrapper>
          ),
          method: item.method,
        };
      }
      default: {
        return {
          indexer: item.indexer,
          hash: motion.hash,
          time: dayjs(item.indexer.blockTime).format("YYYY-MM-DD HH:mm:ss"),
          status: { value: item.method, type },
          method: item.method,
        };
      }
    }
  });
}
