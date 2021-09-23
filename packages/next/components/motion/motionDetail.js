import styled from "styled-components";
import KVList from "components/kvList";
import Link from "next/link";
import dayjs from "dayjs";

import User from "components/user";
import MotionProposal from "./motionProposal";
import Links from "../timeline/links";
import Timeline from "../timeline";
import { getNode, toPrecision } from "utils";
import SectionTag from "components/sectionTag";
import findLastIndex from "lodash.findlastindex";
import Flex from "../styled/flex";
import { shadow_100 } from "../../styles/componentCss";

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

export default function MotionDetail({ motion, chain }) {
  if (!motion) {
    return null;
  }

  const node = getNode(chain);
  if (!node) {
    return null;
  }
  const decimals = node.decimals;
  const symbol = node.symbol;

  const treasuryProposalMeta = motion.treasuryProposal?.meta;

  const timeline = createMotionTimelineData(motion);

  let timelineData;

  if (isClosed(timeline)) {
    timelineData = getClosedTimelineData(timeline);
  } else {
    timelineData = timeline;
  }

  return (
    <div>
      <Wrapper>
        <div>
          <TitleWrapper>
            {motion?.index !== undefined && <Index>{`#${motion.index}`}</Index>}
            <Title>
              {motion?.proposal?.section} {motion?.proposal?.method}
            </Title>
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
            </DividerWrapper>
            {motion.status && <StatusWrapper>{motion.status}</StatusWrapper>}
          </FlexWrapper>
        </div>
      </Wrapper>

      {treasuryProposalMeta && (
        <KVList
          title={"Business"}
          data={[
            [
              "Link to",
              <Link
                href={`/${chain}/treasury/proposal/${motion.treasuryProposalIndex}`}
              >{`Treasury Proposal #${motion.treasuryProposalIndex}`}</Link>,
            ],
            [
              "Beneficiary",
              <Flex>
                <User
                  chain={chain}
                  add={treasuryProposalMeta.beneficiary}
                  fontSize={14}
                />
                <Links
                  chain={chain}
                  address={treasuryProposalMeta.beneficiary}
                  style={{ marginLeft: 8 }}
                />
              </Flex>,
            ],
            [
              "Value",
              `${toPrecision(
                treasuryProposalMeta.value ?? 0,
                decimals
              )} ${symbol}`,
            ],
            [
              "Bond",
              `${toPrecision(
                treasuryProposalMeta.bond ?? 0,
                decimals
              )} ${symbol}`,
            ],
          ]}
        />
      )}

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
          ["Index", motion.index],
          ["Threshold", motion.threshold],
          ["Hash", motion.hash],
          [<MotionProposal motion={motion} chain={chain} />],
        ]}
      />

      <Timeline data={timelineData} chain={chain} indent={false} />
    </div>
  );
}
