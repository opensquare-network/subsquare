import React, { useEffect, useState } from "react";
import { useDetailType } from "../../../context/page";
import sortTimeline from "../../../utils/timeline/sort";
import Timeline from "../../timeline";
import { createMotionTimelineData } from "@subsquare/next/utils/timeline/motion";
import IpfsCidWithLink from "../ipfsCidWithLink";
import formatTime from "../../../utils/viewfuncs/formatDate";
import { detailMultiTabsIsTimelineCompactModeSelector } from "next-common/store/reducers/detailSlice";
import { useSelector } from "react-redux";

function getData(item) {
  const { method, args = {} } = item;
  if ("Announced" === method) {
    return {
      cid: <IpfsCidWithLink cid={args.cid} />,
    };
  }

  return args;
}

export default function AnnouncementTimeline({ data }) {
  const type = useDetailType();

  const { timeline = [], motion } = data;

  const [timelineData, setTimelineData] = useState([]);
  useEffect(() => {
    const data = timeline.map((item) => {
      const { indexer, method } = item;
      return {
        indexer: item.indexer,
        time: formatTime(indexer?.blockTime),
        status: { value: method, type },
        data: getData(item),
      };
    });
    const motionTimeline = createMotionTimelineData(
      motion,
      true,
      "/alliance/motions",
    );

    setTimelineData(sortTimeline([...data, ...motionTimeline].filter(Boolean)));
  }, [timeline, motion, type]);

  const isTimelineCompact = useSelector(
    detailMultiTabsIsTimelineCompactModeSelector,
  );

  return (
    <Timeline data={timelineData} indent={false} compact={isTimelineCompact} />
  );
}
