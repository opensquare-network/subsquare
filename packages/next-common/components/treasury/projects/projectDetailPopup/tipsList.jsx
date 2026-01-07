import ProjectItemsList from "./itemsList";
import { tipColumnsDef } from "./columns";

export default function ProjectTipsList({ tips = [], loading = false }) {
  return (
    <ProjectItemsList
      items={tips}
      loading={loading}
      columnsDef={tipColumnsDef}
      noDataText="No tips"
    />
  );
}
