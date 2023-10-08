import Voting from "next-common/components/timelineMotionVoting";
import businessCategory from "next-common/utils/consts/business/category";
import styled from "styled-components";
import Flex from "next-common/components/styled/flex";
import AyeNay from "next-common/components/collective/AyeNay";
import getMotionExecutedResult, {
  isMotionExecutedSucceed,
} from "next-common/utils/collective/result";
import formatTime from "next-common/utils/viewfuncs/formatDate";
import AddressUser from "next-common/components/user/addressUser";

const VoteResultWrapper = styled(Flex)`
  justify-content: space-between;
`;

export function createArgs(method, args) {
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
          value: <AddressUser add={curator.value.id} />,
        },
      ];
    }
    default:
      return [];
  }
}

function getTimelineItemCommonData(item, motion, type) {
  return {
    indexer: item.indexer,
    hash: motion.hash,
    time: formatTime(item.indexer.blockTime),
    method: item.method,
    status: { value: item.method, type },
  };
}

export function createMotionTimelineData(
  motion = {},
  linkable = false,
  linkPrefix = "",
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
          ...getTimelineItemCommonData(item, motion, type),
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
                args: createArgs(proposal.method, proposal.args),
                total: threshold || voting?.threshold,
                ayes: tally?.yesVotes || (voting?.ayes || []).length,
                nays: tally?.noVotes || (voting?.nays || []).length,
              }}
            />
          ),
        };
      }
      case "Voted": {
        return {
          ...getTimelineItemCommonData(item, motion, type),
          status: { value: "Vote", type },
          data: (
            <VoteResultWrapper>
              <AddressUser add={item.args.voter} />
              <AyeNay isAye={item.args.approve} />
            </VoteResultWrapper>
          ),
        };
      }
      case "Executed": {
        return {
          ...getTimelineItemCommonData(item, motion, type),
          data: getMotionExecutedResult(item.args?.dispatchResult),
          status: {
            value: "Executed",
            type,
            args: { isOk: isMotionExecutedSucceed(item.args?.dispatchResult) },
          },
        };
      }
      default: {
        return getTimelineItemCommonData(item, motion, type);
      }
    }
  });
}
