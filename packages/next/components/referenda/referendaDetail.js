import styled, { css } from "styled-components";
import KVList from "components/kvList";
import Link from "next/link";
import dayjs from "dayjs";

import User from "components/user";
import Links from "../timeline/links";
import Timeline from "../timeline";
import { getNode, timeDuration, toPrecision } from "utils";
import Vote from "./vote";

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

const Info = styled.div`
  font-size: 12px;
  color: #506176;
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

const GreyWrapper = styled(Flex)`
  margin-bottom: 16px;
  height: 38px;
  background: #f6f7fa;
  justify-content: center;
  font-weight: 500;

  svg {
    margin-left: 8px;
    margin-right: 8px;
  }

  a {
    color: #1f70c7;
  }
`;

function getMotionType(data) {
  return `Democracy`;
}

function createMotionTimelineData(data) {
  return (data?.timeline || []).map((item) => {
    switch (item?.method) {
      case "Proposed": {
        return {
          indexer: item.indexer,
          time: dayjs(item.indexer.blockTime).format("YYYY-MM-DD HH:mm:ss"),
          status: { value: `Motion #${data.index}`, color: "#6848FF" },
          voting: {
            proposer: data.proposer,
            method: data.proposal?.method,
            args: data.proposal.args,
            total: data.voting.threshold,
            ayes: data.voting.ayes.length,
            nays: data.voting.nays.length,
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
          status: { value: item?.method, color: "#6848FF" },
        };
      }
    }
  });
}

export default function MotionDetail({ data, chain }) {
  if (!data) {
    return null;
  }

  const node = getNode(chain);
  if (!node) {
    return null;
  }
  const decimals = node.decimals;
  const symbol = node.symbol;

  const type = getMotionType(data);

  const treasuryProposalMeta = data.treasuryProposal?.meta;

  const timelineData = createMotionTimelineData(data);

  return (
    <div>
      <Wrapper>
        <div>
          <GreyWrapper>
            <Link
              href={`/${chain}/democracy/proposal/${data.proposalIndex}`}
            >{`Proposal #${data.proposalIndex}`}</Link>
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0)">
                <path
                  d="M5.2002 3.46671C5.2002 3.05175 5.66997 2.84393 5.94472 3.13736L8.94472 6.34129C9.28536 6.70509 9.28535 7.29491 8.94472 7.65871L5.94472 10.8626C5.66997 11.1561 5.2002 10.9483 5.2002 10.5333L5.2002 3.46671Z"
                  fill="#9DA9BB"
                />
              </g>
              <defs>
                <clipPath id="clip0">
                  <rect width="14" height="14" fill="white" />
                </clipPath>
              </defs>
            </svg>
            <span>Referenda #{data.index}</span>
          </GreyWrapper>
          <DividerWrapper style={{ marginBottom: 12 }}>
            {data.index && <Index>{`#${data.index}`}</Index>}
            {data.method && (
              <span style={{ fontSize: 12, color: "#506176" }}>Method</span>
            )}
          </DividerWrapper>
          <Title>{data.title}</Title>
          <FlexWrapper>
            <DividerWrapper>
              <User
                user={data?.author}
                add={data.proposer}
                chain={chain}
                fontSize={12}
              />
              {type && (
                <div>
                  <TypeWrapper color={getTypeColor(type)}>{type}</TypeWrapper>
                </div>
              )}
              {data.remaining && (
                <Info>{`${timeDuration(data.remaining)}`}</Info>
              )}
              {data.commentsCount > -1 && (
                <Info>{`${data.commentsCount} Comments`}</Info>
              )}
            </DividerWrapper>
            {data.status && <StatusWrapper>{data.status}</StatusWrapper>}
          </FlexWrapper>
        </div>
      </Wrapper>

      <Vote />

      {treasuryProposalMeta && (
        <KVList
          title={"Business"}
          data={[
            [
              "Link to",
              <Link
                href={`/${chain}/proposal/${data.treasuryProposalIndex}`}
              >{`Treasury Proposal #${data.treasuryProposalIndex}`}</Link>,
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
              <User add={data.proposer} fontSize={14} />
              <Links
                chain={chain}
                address={data.proposer}
                style={{ marginLeft: 8 }}
              />
            </>,
          ],
          ["Index", data.index],
          ["Threshold", data.threshold],
          ["Hash", data.hash],
        ]}
      />

      {/*<Timeline data={timelineData} chain={chain} />*/}
    </div>
  );
}
