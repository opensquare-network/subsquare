import dayjs from "dayjs";
import Timeline from "next-common/components/timeline";
import User from "next-common/components/user";
import { toPrecision } from "next-common/utils";
import { parseGov2TrackName } from "next-common/utils/gov2";
import { getGov2ReferendumStateArgs } from "next-common/utils/gov2/result";
import styled from "styled-components";
import { useChainSettings } from "next-common/context/chain";

const Info = styled.div`
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  color: #1e2134;
`;

function TimelineTallyInfo({ decimals, symbol, ayes, nays, support }) {
  return (
    <div>
      <Info>Ayes ({`${toPrecision(ayes ?? 0, decimals)} ${symbol}`})</Info>
      <Info>Nays ({`${toPrecision(nays ?? 0, decimals)} ${symbol}`})</Info>
      <Info>
        Support ({`${toPrecision(support ?? 0, decimals)} ${symbol}`})
      </Info>
    </div>
  );
}

const getTimelineData = (args, method, trackInfo, chain) => {
  const { decimals, symbol } = useChainSettings();

  switch (method) {
    case "Submitted": {
      return {
        Proposer: <User add={args.proposer} />,
        Track: parseGov2TrackName(trackInfo.name),
        "Proposal Hash":
          args.proposal?.legacy?.hash || args.proposal?.lookup?.hash,
      };
    }
    case "DecisionDepositPlaced": {
      return {
        From: <User add={args.who} />,
        "Final tip value": `${toPrecision(
          args.amount ?? 0,
          decimals
        )} ${symbol}`,
      };
    }
    case "DecisionStarted": {
      return {
        Track: parseGov2TrackName(trackInfo.name),
        Tally: (
          <TimelineTallyInfo
            decimals={decimals}
            symbol={symbol}
            {...args.tally}
          />
        ),
      };
    }
    case "Confirmed":
    case "Cancelled":
    case "Killed":
    case "Rejected":
    case "TimedOut": {
      return {
        Tally: (
          <TimelineTallyInfo
            decimals={decimals}
            symbol={symbol}
            {...args.tally}
          />
        ),
      };
    }
    case "Executed": {
      const rawResult = args.result;
      let result;
      if (typeof rawResult === "boolean") {
        result = rawResult;
      } else if (typeof args.result === "object") {
        result = Object.keys(rawResult)[0];
      } else {
        result = JSON.stringify(rawResult);
      }

      return { result };
    }
  }

  return args;
};

export function makeReferendumTimelineData(timeline, trackInfo, chain, type) {
  return (timeline || []).map((item) => {
    return {
      time: dayjs(item.indexer.blockTime).format("YYYY-MM-DD HH:mm:ss"),
      indexer: item.indexer,
      status: {
        value: item.method ?? item.name,
        type,
        args: getGov2ReferendumStateArgs(item),
      },
      data: getTimelineData(
        item.args,
        item.method ?? item.name,
        trackInfo,
        chain
      ),
    };
  });
}

export default function ReferendumTimeline({
  timeline,
  trackInfo,
  chain,
  type,
}) {
  const timelineData = makeReferendumTimelineData(
    timeline,
    trackInfo,
    chain,
    type
  );

  return <Timeline data={timelineData} />;
}
