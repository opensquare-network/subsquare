import dayjs from "dayjs";
import { useDetailType } from "../../../context/page";
import sortTimeline from "../../../utils/timeline/sort";
import Timeline from "../../timeline";
import { createMotionTimelineData } from "@subsquare/next/utils/timeline/motion";
import ExternalLink from "../../externalLink";
import getIpfsLink from "../../../utils/env/ipfsEndpoint";

function IpfsCidWithLink({ cid }) {
  const text = `${ cid.slice(0, 4) }...${ cid.slice(-4) }`;
  return <ExternalLink
    title={ cid }
    href={ getIpfsLink(cid) }>{ text }</ExternalLink>
}

function getData(item) {
  const { method, args = {} } = item;
  if ("Announced" === method) {
    return {
      cid: <IpfsCidWithLink cid={ args.cid } />
    }
  }

  return args;
}

export default function AnnouncementTimeline({ data }) {
  const type = useDetailType();

  const { timeline = [], motion } = data;
  const timelineData = timeline.map(item => {
    const { indexer, method } = item;
    return {
      indexer: item.indexer,
      time: dayjs(indexer?.blockTime).format("YYYY-MM-DD HH:mm:ss"),
      status: { value: method, type },
      data: getData(item),
    };
  })
  const motionTimeline = createMotionTimelineData(motion, true, "/alliance/motion");
  timelineData.push(motionTimeline);
  sortTimeline(timelineData);
  return <Timeline data={ timelineData } indent={ false } />;
}
