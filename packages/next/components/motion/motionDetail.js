import styled, { css } from "styled-components";
import KVList from "components/kvList";
import Link from "next/link";
import dayjs from "dayjs";

import User from "components/user";
import MotionProposal from "./motionProposal";
import Links from "../timeline/links";
import Timeline from "../timeline";
import { getNode, toPrecision } from "utils";
import AccountLinks from "../timeline/accountLinks";

const Wrapper = styled.div`
  background: #ffffff;
  border: 1px solid #ebeef4;
  box-shadow: 0 6px 7px rgba(30, 33, 52, 0.02),
    0 1.34018px 1.56354px rgba(30, 33, 52, 0.0119221),
    0 0.399006px 0.465507px rgba(30, 33, 52, 0.00807786);
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

const DividerWrapper = styled.div`
  display: flex;
  align-items: center;

  > :not(:first-child) {
    ::before {
      content: "·";
      font-size: 12px;
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

const TypeWrapper = styled.div`
  display: inline-block;
  height: 20px;
  line-height: 20px;
  border-radius: 10px;
  background: linear-gradient(0deg, #fef4f7, #fef4f7), #e81f66;
  font-weight: 500;
  font-size: 12px;
  padding: 0 8px;
  ${(p) =>
    p.color &&
    css`
      color: ${p.color};
    `}
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

const getTypeColor = (type) => {
  switch (type) {
    case "Democracy":
      return "#E81F66";
    case "Council":
      return "#E81F66";
    case "Treasury":
      return "#FF9800";
    default:
      return null;
  }
};

const Index = styled.div`
  font-weight: bold;
  font-size: 12px;
`;

const FlexWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Flex = styled.div`
  display: flex;
  align-items: center; ;
`;

function getMotionType(motion) {
  return motion.isTreasury ? "Treasury" : "";
}

function createMotionTimelineData(motion) {
  return (motion.timeline || []).map((item) => {
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
        };
      }
      default: {
        return {
          indexer: item.indexer,
          time: dayjs(item.indexer.blockTime).format("YYYY-MM-DD HH:mm:ss"),
          status: { value: item.method, color: "#6848FF" },
        };
      }
    }
  });
}

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

  const type = getMotionType(motion);

  const treasuryProposalMeta = motion.treasuryProposal?.meta;

  const timelineData = createMotionTimelineData(motion);

  return (
    <div>
      <Wrapper>
        <div>
          <DividerWrapper style={{ marginBottom: 12 }}>
            <Index>{`#${motion.index}`}</Index>
            <span style={{ fontSize: 12, color: "#506176" }}>
              {motion.proposal.method}
            </span>
          </DividerWrapper>
          <Title>{`${motion.proposal.section}.${motion.proposal.method}`}</Title>
          <FlexWrapper>
            <DividerWrapper>
              <User
                user={motion?.author}
                add={motion.proposer}
                chain={chain}
                fontSize={12}
              />
              {type && (
                <div>
                  <TypeWrapper color={getTypeColor(type)}>{type}</TypeWrapper>
                </div>
              )}
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
                href={`/${chain}/proposal/${motion.treasuryProposalIndex}`}
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
              <AccountLinks
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

      <Timeline data={timelineData} chain={chain} />
    </div>
  );
}
