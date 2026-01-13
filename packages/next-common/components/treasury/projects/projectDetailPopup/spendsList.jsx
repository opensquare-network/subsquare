import ProjectItemsList from "./itemsList";
import { spendColumnsDef } from "./columns";

export default function ProjectSpendsList({ spends = [], loading = false }) {
  return (
    <ProjectItemsList
      items={spends}
      loading={loading}
      columnsDef={spendColumnsDef}
      noDataText="No spends"
    />
  );
}
