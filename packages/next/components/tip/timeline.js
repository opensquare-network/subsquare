import styled from "styled-components";
import { findLastIndex } from "lodash-es";
import { getTimelineStatus } from "utils";
import Timeline from "next-common/components/timeline";
import { detailPageCategory } from "next-common/utils/consts/business/category";
import SymbolBalance from "next-common/components/values/symbolBalance";
import formatTime from "next-common/utils/viewfuncs/formatDate";
import { useEffect, useState } from "react";
import { useIsTimelineCompact } from "next-common/components/detail/detailMultiTabs";
import AddressUser from "next-common/components/user/addressUser";

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
    (item) => item?.method === "tip",
  );
  if (firstTipIndex > 0) {
    firstTipIndex--;
  }

  if (firstTipIndex >= lastTipIndex) {
    return timeline;
  }

  const foldItems = timeline.filter(
    (item, idx) => idx >= firstTipIndex && idx <= lastTipIndex,
  );
  const notFoldItems = timeline.filter(
    (item, idx) => idx < firstTipIndex || idx > lastTipIndex,
  );
  const fd = [...foldItems];
  return [fd, ...notFoldItems];
};

export default function TipTimeline({ tip }) {
  const getTimelineData = (args, method) => {
    switch (method) {
      case "tipNew":
      case "reportAwesome":
        return {
          Finder: (
            <FlexEnd>
              <AddressUser add={args.finder} />
            </FlexEnd>
          ),
          Beneficiary: (
            <FlexEnd>
              <AddressUser add={args.beneficiary?.id || args.beneficiary} />
            </FlexEnd>
          ),
          Reason: args.reason,
        };
      case "tip":
        // eslint-disable-next-line no-case-declarations
        const value = args.award ? args.award : args.value;
        return {
          Tipper: (
            <FlexEnd>
              <AddressUser add={args.tipper} />
            </FlexEnd>
          ),
          Value: <SymbolBalance value={value} />,
        };
      case "TipClosed":
        return {
          Beneficiary: (
            <FlexEnd>
              <AddressUser add={args.beneficiary} />
            </FlexEnd>
          ),
          Payout: <SymbolBalance value={args.payout} />,
        };
    }
    return args;
  };

  const [timelineData, setTimelineData] = useState([]);
  useEffect(() => {
    let data = (tip?.timeline || []).map((item) => {
      return {
        time: formatTime(item.indexer.blockTime),
        indexer: item.indexer,
        status: getTimelineStatus(detailPageCategory.TREASURY_TIP, item.method),
        data: getTimelineData(item.args, item.method),
        method: item.method,
      };
    });

    if (isClosed(data)) {
      data = getClosedTimelineData(data);
    }

    setTimelineData(data);
  }, [tip]);

  const isTimelineCompact = useIsTimelineCompact();

  return (
    <Timeline data={timelineData} indent={false} compact={isTimelineCompact} />
  );
}
