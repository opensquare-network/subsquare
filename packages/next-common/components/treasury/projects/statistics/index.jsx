import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import ProjectStatisticsChart from "./chart";

export default function Statistics({ data }) {
  const { label, category, projects = [], totalFiat } = data ?? {};

  if (projects?.length === 0 || !totalFiat || !label || !category) {
    return null;
  }

  return (
    <SecondaryCard className="flex flex-col gap-y-4">
      <div className="text-textPrimary text14Bold">{label}</div>
      <div className="flex gap-x-6 gap-y-4 justify-start w-full max-sm:flex-col">
        <ProjectStatisticsChart
          projects={projects}
          totalFiat={totalFiat}
          category={category}
        />
      </div>
    </SecondaryCard>
  );
}
