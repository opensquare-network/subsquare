import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import ProjectStatisticsChart from "./chart";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import Tooltip from "next-common/components/tooltip";

export default function Statistics({ data }) {
  const { label, category, projects = [], totalFiat } = data ?? {};

  if (projects?.length === 0 || !totalFiat || !label || !category) {
    return null;
  }

  return (
    <div>
      <TitleContainer className="justify-start mb-4">
        <div className="flex gap-x-1">
          {label}
          <Tooltip content="The prices are calculated at awarded time."></Tooltip>
        </div>
      </TitleContainer>
      <SecondaryCard className="flex gap-x-6 gap-y-4 justify-start w-full max-sm:flex-col">
        <ProjectStatisticsChart
          projects={projects}
          totalFiat={totalFiat}
          category={category}
        />
      </SecondaryCard>
    </div>
  );
}
