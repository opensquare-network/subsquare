import { usePost } from "next-common/context/post";
import { useDetailType } from "next-common/context/page";
import { createMotionTimelineData } from "@subsquare/next/utils/timeline/motion";
import { useMemo } from "react";
import IpfsCidWithLink from "next-common/components/alliance/ipfsCidWithLink";
import formatTime from "next-common/utils/viewfuncs/formatDate";

function getData(item) {
  const { method, args = {} } = item;
  if ("Announced" === method) {
    return {
      cid: <IpfsCidWithLink cid={args.cid} />,
    };
  }

  return args;
}

export default function useAllianceAnnouncementTimelineData() {
  const type = useDetailType();
  const { timeline = [], motion } = usePost();

  const data = useMemo(() => {
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
    return [...data, ...motionTimeline];
  }, [motion, timeline, type]);
  return data;
}
