import Timeline from "./timeline";
import IdentityTimelineItemFields from "./itemFields";

export default function IdentityTimeline({ timelineData, isLoading }) {
  return (
    <Timeline
      timeline={timelineData}
      loading={isLoading}
      FieldsComponent={IdentityTimelineItemFields}
    />
  );
}
