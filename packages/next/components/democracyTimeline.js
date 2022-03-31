import { makeMotionTimelineData } from "./motion/timeline";
import { makeExternalTimelineData } from "./external/timeline";
import { makeReferendumTimelineData } from "./referenda/timeline";
import { makePublicProposalTimelineData } from "./publicProposal/timeline";
import Timeline from "next-common/components/timeline";

export default function DemocracyTimeline({
  councilMotion,
  publicProposal,
  external,
  techCommMotion,
  referendum,
  chain,
}) {
  const councilMotionTimelineData = makeMotionTimelineData(
    councilMotion,
    chain
  );
  const publicProposalTimelineData = makePublicProposalTimelineData(
    publicProposal?.timeline,
    chain
  );
  const externalTimelineData = makeExternalTimelineData(external?.timeline);
  const techCommMotionTimelineData = makeMotionTimelineData(
    techCommMotion,
    chain
  );
  const referendumTimelineData = makeReferendumTimelineData(
    referendum?.timeline
  );
  const completeTimelineData = [
    ...councilMotionTimelineData,
    ...publicProposalTimelineData,
    ...externalTimelineData,
    ...techCommMotionTimelineData,
    ...referendumTimelineData,
  ];
  return <Timeline data={completeTimelineData} chain={chain} />;
}
