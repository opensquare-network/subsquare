/* eslint-disable react/jsx-key */
import styled from "styled-components";
import findLastIndex from "lodash.findlastindex";
import { getTimelineStatus, getNode, toPrecision } from "utils";
import Timeline from "next-common/components/timeline";
import dayjs from "dayjs";
import User from "next-common/components/user";
import { detailPageCategory } from "next-common/utils/consts/business/category";

const FlexEnd = styled.div`
  display: flex;
  justify-content: right;
`;

const isClosed = (timeline) => {
  return (timeline || []).some((item) => item.method === "TipClosed");
};

const getClosedTimelineData = (timeline = []) => {
  let firstTipIndex = timeline.findIndex((item) => item?.method === "tip");
  const lastTipIndex = findLastIndex(
    timeline,
    (item) => item?.method === "tip"
  );
  if (firstTipIndex > 0) {
    firstTipIndex--;
  }

  if (firstTipIndex >= lastTipIndex) {
    return timeline;
  }

  const foldItems = timeline.filter(
    (item, idx) => idx >= firstTipIndex && idx <= lastTipIndex
  );
  const notFoldItems = timeline.filter(
    (item, idx) => idx < firstTipIndex || idx > lastTipIndex
  );
  const fd = [...foldItems];
  return [fd, ...notFoldItems];
};

export default function TipTimeline({ tip, chain }) {
  const node = getNode(chain);
  if (!node) {
    return null;
  }
  const decimals = node.decimals;
  const symbol = node.symbol;

  const getTimelineData = (args, method) => {
    switch (method) {
      case "reportAwesome":
        return {
          Finder: (
            <FlexEnd>
              <User chain={chain} add={args.finder} />
            </FlexEnd>
          ),
          Beneficiary: (
            <FlexEnd>
              <User chain={chain} add={args.beneficiary} />
            </FlexEnd>
          ),
          Reason: args.reason,
        };
      case "tip":
        const value = args.award ? args.award : args.value;
        return {
          Tipper: (
            <FlexEnd>
              <User chain={chain} add={args.tipper} />
            </FlexEnd>
          ),
          Value: `${toPrecision(value ?? 0, decimals)} ${symbol}`,
        };
      case "TipClosed":
        return {
          Beneficiary: (
            <FlexEnd>
              <User chain={chain} add={args.beneficiary} />
            </FlexEnd>
          ),
          Payout: `${toPrecision(args.payout ?? 0, decimals)} ${symbol}`,
        };
    }
    return args;
  };

  let timeline = (tip?.timeline || []).map((item) => {
    return {
      time: dayjs(item.indexer.blockTime).format("YYYY-MM-DD HH:mm:ss"),
      indexer: item.indexer,
      status: getTimelineStatus(detailPageCategory.TREASURY_TIP, item.method),
      data: getTimelineData(item.args, item.method),
      method: item.method,
    };
  });

  if (isClosed(timeline)) {
    timeline = getClosedTimelineData(timeline);
  }

  return <Timeline data={timeline} chain={chain} indent={false} />;
}
