/* eslint-disable react/jsx-key */
import styled from "styled-components";
import KVList from "components/kvList";
import MultiKVList from "components/multiKVList";
import Link from "next/link";
import dayjs from "dayjs";

import User from "components/user";
import MotionProposal from "./motionProposal";
import Links from "../timeline/links";
import Timeline from "../timeline";
import { getNode, timeDurationFromNow, toPrecision } from "utils";
import SectionTag from "components/sectionTag";
import findLastIndex from "lodash.findlastindex";
import Flex from "../styled/flex";
import { shadow_100 } from "../../styles/componentCss";
import ArticleContent from "../articleContent";
import { isMotionCompleted } from "../../utils/viewfuncs";
import { withLoginUserRedux } from "../../lib";
import { useState } from "react";
import CapitalText from "../capitalText";

const Wrapper = styled.div`
  background: #ffffff;
  border: 1px solid #ebeef4;
  ${shadow_100};
  border-radius: 6px;
  padding: 48px;
  @media screen and (max-width: 768px) {
    padding: 24px;
    border-radius: 0;
  }

  :hover {
    .edit {
      display: block;
    }
  }
`;

const DividerWrapper = styled(Flex)`
  flex-wrap: wrap;

  > :not(:first-child) {
    ::before {
      content: "·";
      font-size: 12px;
      color: #9da9bb;
      margin: 0 8px;
    }
  }
`;

const TitleWrapper = styled.div`
  margin-bottom: 8px;
  overflow: hidden;

  > :not(:first-child) {
    ::before {
      content: "·";
      font-size: 20px;
      line-height: 28px;
      color: #9da9bb;
      margin: 0 8px;
    }
  }
`;

const Title = styled.div`
  max-width: 750px;
  word-break: break-all;
  font-weight: 500;
  font-size: 20px;
  line-height: 140%;
  margin-bottom: 12px;
`;

const StatusWrapper = styled.div`
  background: #2196f3;
  border-radius: 2px;
  font-weight: 500;
  font-size: 12px;
  height: 20px;
  line-height: 20px;
  padding: 0 8px;
  color: #ffffff;
`;

const Index = styled.div`
  float: left;
  font-weight: 500;
  font-size: 20px;
  line-height: 140%;
`;

const FlexWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: nowrap;
`;

const Info = styled.div`
  font-size: 12px;
  color: #506176;
`;

function createMotionTimelineData(motion) {
  return (motion?.timeline || []).map((item) => {
    switch (item.method) {
      case "Proposed": {
        return {
          indexer: item.indexer,
          time: dayjs(item.indexer.blockTime).format("YYYY-MM-DD HH:mm:ss"),
          status: { value: `Motion #${motion.index}`, color: "#6848FF" },
          voting: {
            proposer: motion.proposer,
            method: motion.proposal.method,
            args: motion.proposal.args,
            total: motion.voting.threshold,
            ayes: motion.voting.ayes.length,
            nays: motion.voting.nays.length,
          },
          method: item.method,
        };
      }
      case "Voted": {
        return {
          indexer: item.indexer,
          time: dayjs(item.indexer.blockTime).format("YYYY-MM-DD HH:mm:ss"),
          status: { value: "Vote", color: "#6848FF" },
          voteResult: {
            name: item.args.voter,
            value: item.args.approve,
          },
          method: item.method,
        };
      }
      default: {
        return {
          indexer: item.indexer,
          time: dayjs(item.indexer.blockTime).format("YYYY-MM-DD HH:mm:ss"),
          status: { value: item.method, color: "#6848FF" },
          method: item.method,
        };
      }
    }
  });
}

function createMotionBusinessData(motion) {
  const height = motion.state.indexer.blockHeight;
  return [
    [
      "Link to",
      <Link
        href={`/democracy/external/${height}_${motion.proposalHash}`}
      >{`External proposal ${motion.proposalHash.slice(0, 8)}`}</Link>,
    ],
  ];
}

const isClosed = (timeline) => {
  return (timeline || []).some((item) => item.method === "Closed");
};

const getClosedTimelineData = (timeline = []) => {
  let firstFoldIndex = timeline.findIndex((item) => item?.method === "Voted");
  const lastFoldIndex = findLastIndex(
    timeline,
    (item) => item?.method === "Voted"
  );
  if (firstFoldIndex > 0) {
    firstFoldIndex--;
  }

  if (firstFoldIndex >= lastFoldIndex) {
    return timeline;
  }

  const foldItems = timeline.filter(
    (item, idx) => idx >= firstFoldIndex && idx <= lastFoldIndex
  );
  const notFoldItems = timeline.filter(
    (item, idx) => idx < firstFoldIndex || idx > lastFoldIndex
  );
  const fd = [...foldItems];
  return [fd, ...notFoldItems];
};

export default withLoginUserRedux(({ loginUser, motion, onReply, chain }) => {
  const node = getNode(chain);
  if (!node) {
    return null;
  }
  const [post, setPost] = useState(motion);
  const decimals = node.decimals;
  const symbol = node.symbol;

  const timeline = createMotionTimelineData(motion.onchainData);

  let timelineData;

  if (isClosed(timeline)) {
    timelineData = getClosedTimelineData(timeline);
  } else {
    timelineData = timeline;
  }

  let business = null;

  const motionCompleted = isMotionCompleted(motion);

  if (motionCompleted) {
    business = createMotionBusinessData(motion, chain);
  }

  if (
    motion.onchainData.treasuryProposals?.length > 0 ||
    motion.onchainData.treasuryBounties?.length > 0
  ) {
    business = [];
    for (const proposal of motion.onchainData.treasuryProposals) {
      business.push([
        [
          "Link to",
          <Link
            href={`/treasury/proposal/${proposal.proposalIndex}`}
          >{`Treasury Proposal #${proposal.proposalIndex}`}</Link>,
        ],
        [
          "Beneficiary",
          <Flex>
            <User chain={chain} add={proposal.meta.beneficiary} fontSize={14} />
            <Links
              chain={chain}
              address={proposal.meta.beneficiary}
              style={{ marginLeft: 8 }}
            />
          </Flex>,
        ],
        [
          "Value",
          `${toPrecision(proposal.meta.value ?? 0, decimals)} ${symbol}`,
        ],
        ["Bond", `${toPrecision(proposal.meta.bond ?? 0, decimals)} ${symbol}`],
      ]);
    }

    for (const bounty of motion.onchainData.treasuryBounties) {
      const kvData = [];

      kvData.push([
        "Link to",
        <Link
          href={`/treasury/bounty/${bounty.bountyIndex}`}
        >{`Treasury Bounty #${bounty.bountyIndex}`}</Link>,
      ]);

      const metadata = bounty.meta ? Object.entries(bounty.meta) : [];
      metadata.forEach((item) => {
        switch (item[0]) {
          case "proposer":
          case "beneficiary":
            kvData.push([
              <CapitalText>{item[0]}</CapitalText>,
              <Flex>
                <User chain={chain} add={item[1]} fontSize={14} />
                <Links
                  chain={chain}
                  address={item[1]}
                  style={{ marginLeft: 8 }}
                />
              </Flex>,
            ]);
            break;
          case "value":
          case "bond":
            kvData.push([
              <CapitalText>{item[0]}</CapitalText>,
              `${toPrecision(item[1] ?? 0, decimals)} ${symbol}`,
            ]);
            break;
        }
      });

      business.push(kvData);
    }
  }

  return (
    <div>
      <Wrapper>
        <div>
          <TitleWrapper>
            {motion?.motionIndex !== undefined && (
              <Index>{`#${motion.motionIndex}`}</Index>
            )}
            <Title>{post?.title}</Title>
          </TitleWrapper>
          <FlexWrapper>
            <DividerWrapper>
              <User
                user={motion?.author}
                add={motion.proposer}
                chain={chain}
                fontSize={12}
              />
              {motion.isTreasury && <SectionTag name={"Treasury"} />}
              {motion.isDemocracy && <SectionTag name={"Democracy"} />}
              {(motion.indexer?.blockTime || motion.createdAt) && (
                <Info>
                  Created{" "}
                  {timeDurationFromNow(
                    motion.indexer?.blockTime || motion.createdAt
                  )}
                </Info>
              )}
            </DividerWrapper>
            {motion.state && <StatusWrapper>{motion.state}</StatusWrapper>}
          </FlexWrapper>
          <ArticleContent
            post={post}
            setPost={setPost}
            user={loginUser}
            onReply={onReply}
            type="motion"
          />
        </div>
      </Wrapper>

      <MultiKVList title="Business" data={business} />

      <KVList
        title={"Metadata"}
        data={[
          [
            "Proposer",
            <>
              <User add={motion.proposer} fontSize={14} />
              <Links
                chain={chain}
                address={motion.proposer}
                style={{ marginLeft: 8 }}
              />
            </>,
          ],
          ["Index", motion?.motionIndex],
          ["Threshold", motion?.onchainData?.threshold],
          ["Hash", motion?.onchainData?.hash],
          [<MotionProposal motion={motion.onchainData} chain={chain} />],
        ]}
      />

      <Timeline data={timelineData} chain={chain} indent={false} />
    </div>
  );
});
