import Timeline from "next-common/components/timeline";

export default function TreasuryProposalTimeline({ timelineData, compact }) {
  return <Timeline data={timelineData} indent={false} compact={compact} />;
}
